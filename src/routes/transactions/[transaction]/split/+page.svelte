<script lang="ts">
    import { selectedEmails, selectedFriends } from "$lib/stores.svelte";
    import * as Tabs from "$lib/components/ui/tabs";
	import { Trigger } from "$lib/components/ui/drawer"

    // print list of people that are involved in this transaction

    // Split the money

    // Add to item_users table

</script>

<!-- Different ways to split money -->
<Tabs.Root value="split_equally">
    <Tabs.List>
        <Tabs.Trigger value="split_equally">Split Equally </Tabs.Trigger>
        <Tabs.Trigger value="split_exact">Split Exact Amounts </Tabs.Trigger>
        <Tabs.Trigger value="split_percent">Split Percentages </Tabs.Trigger>
    </Tabs.List>
    <Tabs.Content value="split_equally">
        111
    </Tabs.Content>
    <Tabs.Content value="split_exact">
        222
    </Tabs.Content>
    <Tabs.Content value="split_percent">
        333
    </Tabs.Content>
</Tabs.Root>
