import { GoogleGenerativeAI, SchemaType } from 'https://esm.sh/@google/generative-ai@0.19.0'
// import { GoogleAIFileManager } from "@google/generative-ai/server";
import { GoogleAIFileManager } from 'https://esm.sh/@google/generative-ai@0.19.0/server'

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

const runGemini = async (image_url: string, env: string, model: string): Promise<Schema> => {
    const fileManager = new GoogleAIFileManager(env)

    const uploadResult = await fileManager.uploadFile(image_url)


	const genAI = new GoogleGenerativeAI(env)

	const aiModel = genAI.getGenerativeModel({ model: model,generationConfig: {
        responseMimeType: 'application/json',
        responseSchema: schema
    }


     })

	const prompt = `You have the best vision in the world. Please read the information from the receipt of the following transaction and provide the structured output`

	const result = await aiModel.generateContent([
        prompt, {
            fileData: {
                fileUri: uploadResult.file.uri,
                mimeType: uploadResult.file.mimeType
            }
        }
    ])
	const response = await result.response
	const responseText = response.text()

    const json = JSON.parse(responseText)

	return json
}

export const getAIResponse = async (image_url: string, env: string, model: string): Promise<Schema> => {
	const aiResponse = await runGemini(image_url, env, model)

	return aiResponse
}