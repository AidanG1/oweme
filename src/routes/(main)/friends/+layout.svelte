<script lang="ts">
	import * as Tabs from '$lib/components/ui/tabs/index.js'
</script>

<Tabs.Root value="friends">
	<Tabs.List class="grid w-full grid-cols-2">
		<Tabs.Trigger value="friends"><a href="/friends">Friends</a></Tabs.Trigger>
		<Tabs.Trigger value="new"><a href="/friends/new">New</a></Tabs.Trigger>
		<Tabs.Trigger value="requests"><a href="/friends/requests">Requests</a></Tabs.Trigger>
	</Tabs.List>
</Tabs.Root>
