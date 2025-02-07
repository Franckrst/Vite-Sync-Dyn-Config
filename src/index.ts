import {HtmlTagDescriptor} from 'vite'

type UserOptions = {
    SSI : {
        enable: boolean,
        path ?: string
    },
    values : unknown,
    injectedVarName : string
};

const DEFAULT_CONFIG: UserOptions = {
    SSI : {
        enable: false,
        path : 'config.json'
    },
    values: {},
    injectedVarName: "window.CONFIG"
}

export function createSyncDynConfigPlugin(
    userOptions: Partial<UserOptions> = {},
): { name: string, transformIndexHtml:()=>HtmlTagDescriptor[] } {
    const config: UserOptions = {...DEFAULT_CONFIG, ...userOptions};
    return {
        name: 'vite-sync-dyn-config',
        transformIndexHtml : (): HtmlTagDescriptor[] =>{
            return [{
                tag: 'script',
                children: `
${ config.SSI.enable ? `<!--# set var="SSI_VITE_CONFIG" value="1" -->
<!--# if expr="$SSI_VITE_CONFIG = 1" -->
    <!--# include virtual="${config.SSI.path}" -->
<!--# else -->` : ``}
${config.injectedVarName} = ${JSON.stringify(config.values)};
${ config.SSI.enable ? `<!--# endif -->`: `` }
`.trim(),
                injectTo: "head"
            }];
        }
    }
}
