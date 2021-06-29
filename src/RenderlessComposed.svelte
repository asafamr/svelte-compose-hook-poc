<script lang="ts">
    import { onDestroy } from "svelte";
    import { createEventDispatcher, setContext } from "svelte";
    import { writable } from "svelte/store";

    // output callback: maybe use `export default` for that?
    export let OUT: (arg: { timeFetched: SvelteStore<string> }) => void;

    // component param
    export let fetch_interval = 1000;

    // lifecycle tied to composer
    console.log("composed renderless component created");
    onDestroy(
        () => (console.log("composed renderless component destoryed"), clearInterval(interval))
    );

    // event forwarding
    let dispatch = createEventDispatcher<{ eventForwarded: string }>();
    dispatch("eventForwarded");

    // context bubble
    setContext("ctx", "overriden from composed");

    let timeFetched = "";
    let interval = setInterval(() => {
        fetch("https://worldtimeapi.org/api/timezone/Europe/London")
            .then((res) => res.json())
            .then((res) => (timeFetched = res["datetime"]));
    }, fetch_interval);

    const outStore = writable("");

    // svelte reactive semantics work
    $: {
        if (timeFetched) {
            const paresedTime = new Date(timeFetched);
            const hours = paresedTime.getHours();
            const txt = hours < 12 ? "Good morning" : "Good afternoon";
            outStore.set(
                `${paresedTime.toLocaleTimeString()}: ${txt} in London`
            );
        }
    }

    OUT({ timeFetched: outStore });
</script>
