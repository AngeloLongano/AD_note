import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import { unified } from '@astrojs/markdown-remark';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

const [githubOwner, githubRepository] = (process.env.GITHUB_REPOSITORY ?? '').split('/');
const isGitHubPagesBuild = Boolean(githubOwner && githubRepository);
const isUserOrOrganizationSite = githubRepository === `${githubOwner}.github.io`;

export default defineConfig({
  site: isGitHubPagesBuild ? `https://${githubOwner}.github.io` : undefined,
  base: isGitHubPagesBuild && !isUserOrOrganizationSite ? `/${githubRepository}` : undefined,
  publicDir: './assets',
  integrations: [mdx()],
  markdown: {
    processor: unified({
      remarkPlugins: [remarkMath],
      rehypePlugins: [rehypeKatex]
    }),
    shikiConfig: { theme: 'github-dark' }
  }
});
