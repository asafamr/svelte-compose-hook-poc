import type { SvelteComponent, SvelteComponentTyped } from "svelte";
import { bubble,  get_current_component } from "svelte/internal";

interface Svelte2TsxComponentConstructorParameters<Props extends {}> {
    /**
     * An HTMLElement to render to. This option is required.
     */
    target: Element;
    /**
     * A child of \`target\` to render the component immediately before.
     */
    anchor?: Element;
    /**
     * An object of properties to supply to the component.
     */
    props?: Props;
    hydrate?: boolean;
    intro?: boolean;
    $$inline?: boolean;
}
type SvelteComponentConstructor<T, U extends Svelte2TsxComponentConstructorParameters<any>> = new (options: U) => T;

type GetOut<Props extends { "OUT": any }> = Props extends { "OUT": (a: infer B) => void } ? B : never;

export default function <Props extends { "OUT": (any) => void }, Events  extends {[key:string]:CustomEvent<any>}, Slots>
    (component: SvelteComponentConstructor<SvelteComponentTyped<Props, Events, Slots>,
        Svelte2TsxComponentConstructorParameters<Props>>, options: {
            params?: Partial<Omit<Props,"OUT">>,
            forwardContextKeys?: string[], 
            forwardEvents?:string[],
        } = { params: {}, forwardContextKeys: [], forwardEvents: [] }): GetOut<Props> {

    const parent: SvelteComponent = get_current_component();
    let ret;
    let comp = new component({ props: { ...options?.params ?? {}, OUT: (x) => ret = x } as any, $$inline: true, target: null });
    for (const key of options?.forwardContextKeys??[]) {
        if(comp.$$.context.has(key)){
            parent.$$.context.set(key, comp.$$.context.get(key));
        }
    }
    for (const event of options?.forwardEvents?? []) {
        if (!comp.$$.callbacks[event]) comp.$$.callbacks[event] = [];
        comp.$$.callbacks[event].push(
            function (event: CustomEvent) {
                bubble(parent, event);
            }
        )
        }
    parent.$$.on_destroy.push(() => comp.$destroy());
    return ret
}


