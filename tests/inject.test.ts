import { describe, test, expect } from "@jest/globals"
import {createSyncDynConfigPlugin} from "../src";

describe('createSyncDynConfigPlugin', () => {

    test('should use the default configuration when no user options are provided', () => {
        const plugin = createSyncDynConfigPlugin();
        expect(plugin.name).toBe('vite-sync-dyn-config');

        const expectedScript = `
window.CONFIG = {};
`;
        const result = plugin.transformIndexHtml();

        expect(result).toEqual([{
            tag: 'script',
            children: expectedScript.trim(),
            injectTo: 'head'
        }]);
    });

    test('should merge user options with the default configuration', () => {
        const userOptions = {
            SSI: {
                enable: true,
                path: 'custom-config.json'
            },
            values: { foo: 'bar' },
            injectedVarName: "window.CustomConfig"
        };

        const plugin = createSyncDynConfigPlugin(userOptions);
        expect(plugin.name).toBe('vite-sync-dyn-config');

        const expectedScript = `
<!--# set var="$SSI_VITE_CONFIG" value="1" -->
<!--# if expr="$SSI_VITE_CONFIG = 1" -->
    <!--# include virtual="custom-config.json" -->
<!--# else -->
window.CustomConfig = {"foo":"bar"};
<!--# endif -->
`;
        const result = plugin.transformIndexHtml();

        expect(result).toEqual([{
            tag: 'script',
            children: expectedScript.trim(),
            injectTo: 'head'
        }]);
    });

    test('should generate correct HTML tags without SSI enabled', () => {
        const userOptions = {
            values: { test: 'data' },
        };

        const plugin = createSyncDynConfigPlugin(userOptions);
        const expectedScript = `
window.CONFIG = {"test":"data"};
`;
        const result = plugin.transformIndexHtml();

        expect(result).toEqual([{
            tag: 'script',
            children: expectedScript.trim(),
            injectTo: 'head'
        }]);
    });

    test('should handle partial user options correctly', () => {
        const userOptions = {
            injectedVarName: "window.customVar"
        };

        const plugin = createSyncDynConfigPlugin(userOptions);
        const expectedScript = `
window.customVar = {};
`;
        const result = plugin.transformIndexHtml();

        expect(result).toEqual([{
            tag: 'script',
            children: expectedScript.trim(),
            injectTo: 'head'
        }]);
    });
});
