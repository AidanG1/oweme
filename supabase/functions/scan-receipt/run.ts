import { GoogleGenerativeAI, SchemaType } from 'https://esm.sh/@google/generative-ai@0.19.0'
// import { GoogleAIFileManager } from "@google/generative-ai/server";
import { GoogleAIFileManager } from 'https://esm.sh/@google/generative-ai@0.19.0/server'

import OpenAI from 'https://esm.sh/openai'
import { z } from 'https://esm.sh/zod'
import { zodResponseFormat } from 'https://esm.sh/openai/helpers/zod'


interface Item {
    ocr_name: string
    full_name: string
    total_cents: number
}

interface Schema {
    name: string
    ordered_timestamp: string
    url: string
    tip_cents: number
    total_cents: number
    tax_cents: number
    subtotal_cents: number
    items: Item[]
}

const schema = {
    description: "Itemized receipt information",
    type: SchemaType.ARRAY,
    items: {
        type: SchemaType.OBJECT,
        properties: {
            name: {
                type: SchemaType.STRING,
                description: "Name of the business"
            },
            ordered_timestamp: {
                type: SchemaType.STRING,
                description: "Timestamp of the order"
            },
            url: {
                type: SchemaType.STRING,
                description: "URL of the receipt"
            },
            tip_cents: {
                type: SchemaType.NUMBER,
                description: "Tip amount in cents"
            },
            total_cents: {
                type: SchemaType.NUMBER,
                description: "Total amount in cents"
            },
            tax_cents: {
                type: SchemaType.NUMBER,
                description: "Tax amount in cents"
            },
            subtotal_cents: {
                type: SchemaType.NUMBER,
                description: "Subtotal amount in cents"
            },
            items: {
                type: SchemaType.ARRAY,
                items: {
                    type: SchemaType.OBJECT,
                    properties: {
                        ocr_name: {
                            type: SchemaType.STRING,
                            description: "Name of the item as recognized by OCR"
                        },
                        full_name: {
                            type: SchemaType.STRING,
                            description: "Full name of the item"
                        },
                        total_cents: {
                            type: SchemaType.NUMBER,
                            description: "Total amount in cents"
                        }
                    }
                }
            }
        }
    }
}

const zodSchema = z.object({
    name: z.string(),
    ordered_timestamp: z.string(),
    url: z.string(),
    tip_cents: z.number(),
    total_cents: z.number(),
    tax_cents: z.number(),
    subtotal_cents: z.number(),
    items: z.array(z.object({
        ocr_name: z.string(),
        full_name: z.string(),
        total_cents: z.number()
    }))
})

const runOpenAI = async (image_url: string, env: string, model: string): Promise<Schema> => {
    const openai = new OpenAI();

    // openai.setApiKey(env);

    const completion = await openai.beta.chat.completions.parse({
        model: model,
        messages: [
            {
                role: "user",
                content: [
                    { type: "text", text: `You have the best vision in the world. Please read the information from the receipt of the following transaction and provide the structured output. 
                    Look at the receipt and provide the following information:
                    - Name of the business
                    - Timestamp of the order
                    - URL of the receipt
                    - Tip amount in cents
                    - Total amount in cents
                    - Tax amount in cents
                    - Subtotal amount in cents
                    - Items on the receipt with the following information:
                        - Name of the item as recognized by OCR
                        - Full name of the item
                        - Total amount in cents

                    Here is the receipt
                        ` },
                    {
                        type: "image_url",
                        image_url: {
                            "url": image_url,
                        },
                    },
                ],
            },
        ],
        response_format: zodResponseFormat(zodSchema, "receipt"),
    })

    console.log(completion)

    const event: Schema = completion.choices[0].message.parsed;

    console.log(event)

    return event
}

const runGemini = async (image_url: string, env: string, model: string): Promise<Schema> => {
    const fileManager = new GoogleAIFileManager(env)

    const uploadResult = await fileManager.uploadFile(image_url)

    console.log('Using image URL:', image_url)


    const genAI = new GoogleGenerativeAI(env)

    const aiModel = genAI.getGenerativeModel({
        model: model, generationConfig: {
            responseMimeType: 'application/json',
            responseSchema: schema
        }
    })

    const prompt = `You have the best vision in the world. Please read the information from the receipt of the following transaction and provide the structured output`

    const result = await aiModel.generateContent([
        prompt, {
            fileData: {
                fileUri: uploadResult.file.uri,
                mimeType: uploadResult.file.mimeType,
            }
        }
    ])
    const response = await result.response
    const responseText = response.text()

    const json = JSON.parse(responseText)

    console.log(json)

    return json
}

export const getAIResponse = async (image_url: string, env: string, model: string): Promise<Schema> => {
    // const aiResponse = await runGemini(image_url, env, model)
    const aiResponse = await runOpenAI(image_url, env, model)

    return aiResponse
}