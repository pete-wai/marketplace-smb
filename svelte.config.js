import adapter from '@sveltejs/adapter-static';
import {mdsvex} from 'mdsvex';
export default {extensions:['.svelte','.svx'],preprocess:[mdsvex({extensions:['.svx']})],kit:{adapter:adapter({pages:'build',assets:'build',strict:true}),paths:{base:'/marketplace-smb'}}};
