import { presetWarp } from '@warp-ds/uno';
import uno from 'unocss/vite';
import nunjucks from 'vite-plugin-nunjucks';
import { iconsBySize } from './scripts/render.js';

export default {
    plugins: [
        uno({presets: [presetWarp({ skipResets: true })],
    }),
    nunjucks.default({ variables: { 'index.html': { iconsBySize: iconsBySize() }}} ),
    ],
    build: {
        emptyOutDir: false,
        rollupOptions: {
            input: ['index.html']
        },
    }
};