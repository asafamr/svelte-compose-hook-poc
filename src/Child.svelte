<script lang="ts">
    import useRenderless from "./useRenderless";
    import RenderlessComposed from "./RenderlessComposed.svelte";
    import { getContext, setContext } from "svelte";

    setContext("ctx", "was set before composing");
    const { timeFetched } = useRenderless(RenderlessComposed, {
        params: { fetch_interval: 2000 },
        forwardContextKeys: ["ctx"],
        forwardEvents: ["eventForwarded"],
    });
    console.log(`context after composing: "${getContext("ctx")}"`,);
</script>

<div>
    {$timeFetched}
</div>

<style>
    div{
        width:30rem;
        height: 10rem;
        display: block;
        line-height: 10rem;
        margin: auto;
        border:1px solid black;
    }
</style>