<script lang="ts">
	import { selectedEmails, selectedFriends } from '$lib/stores.svelte'
	import * as Tabs from '$lib/components/ui/tabs'
	import { Button } from '$lib/components/ui/button'
	import { Trigger } from '$lib/components/ui/drawer'
	import { Input } from '$lib/components/ui/input'
	import { Label } from '$lib/components/ui/label'
	import Checkbox from '$lib/components/ui/checkbox/checkbox.svelte'

</script>

<!-- Different ways to split money -->
<Tabs.Root value="split_itemized">
	<Tabs.List>
		<Tabs.Trigger value="split_equally">Split Equally</Tabs.Trigger>
		<Tabs.Trigger value="split_itemized">Split Itemized</Tabs.Trigger>
		<Tabs.Trigger value="split_exact">Split Exact Amounts</Tabs.Trigger>
		<Tabs.Trigger value="split_percent">Split Percentages</Tabs.Trigger>
	</Tabs.List>
	<Tabs.Content value="split_equally">111</Tabs.Content>
	<Tabs.Content value="split_itemized">333</Tabs.Content>
	<Tabs.Content value="split_exact">222</Tabs.Content>
	<!-- <Tabs.Content value="split_percent">333</Tabs.Content> -->
</Tabs.Root>
