const GhostContentAPI = require('@tryghost/content-api');
const yaml = require('js-yaml');
const fs = require('fs-extra');
const path = require('path');

const ghostURL = process.env.GHOST_URL;
const ghostKey = process.env.GHOST_KEY;
const api = new GhostContentAPI({
	url: ghostURL,
	key: ghostKey,
	version: 'v5.0'
});

const createMdFilesFromGhost = async () => {
    console.time('All tech posts converted to Markdown in');

    try {
        // Fetch  posts from the Ghost Content API
        const posts = await api.posts.browse({
            limit: 'all',
            filter: 'tag:[hash-public]',		
            include: 'tags,authors',
            formats: ['html'],
            order: 'published_at DESC'
        });

        await Promise.all(posts.map(async (post) => {
            let content = post.html;
            
            const frontmatter = {
                title: post.meta_title || post.title,
                description: post.meta_description || post.excerpt,
                pagetitle: post.title,
                slug: post.slug,
                image: post.feature_image,	
		image_credit: post.feature_image_caption,    
                lastmod: post.updated_at,
                date: post.published_at,
                excerpt: post.excerpt,
		relcanonical: post.canonical_url,    
		og_title: post.og_title || post.meta_title || post.title, 
		og_description: post.og_description || post.meta_description || post.excerpt,
		twitter_title: post.twitter_title || post.meta_title || post.title, 
		twitter_description: post.twitter_description || post.meta_description || post.excerpt,		    
                i18nlanguage: 'en', // Change for your language
                weight: post.featured ? 1 : 0,
                draft: post.visibility !== 'public',
            };	

            // The format of og_image is /content/images/2020/04/social-image-filename.jog
            // without the root of the URL. Prepend if necessary.
            let ogImage = post.og_image || post.feature_image || '';
            if (!ogImage.includes('https://www.alanchatfield.ghost.io')) {
                ogImage = 'https://marketingviatechnology.com' + ogImage
            }
            frontmatter.og_image = ogImage;

            if (post.tags && post.tags.length) {
                frontmatter.tags = post.tags.filter(t => t.name != '#public').filter(t => t.name != '#crmtdigital').map(t => t.name);
            }

            // If there's a canonical url, please add it.
            if (post.canonical_url) {
                frontmatter.canonical = post.canonical_url;
            }

            // Create frontmatter properties from all keys in our post object
            const yamlPost = await yaml.dump(frontmatter);

            // Super simple concatenating of the frontmatter and our content
            const fileString = `---\n${yamlPost}\n---\n${content}\n`;

            // Save the final string of our file as a Markdown file
            await fs.writeFile(path.join('content/post', `${post.slug}.md`), fileString, { flag: 'w' });
        }));

    console.timeEnd('All tech posts converted to Markdown in');
    } catch (error) {
        console.error(error);
    }

    console.time('All marketing posts converted to Markdown in');

    try {
        // Fetch  posts from the Ghost Content API
        const posts = await api.posts.browse({
            limit: 'all',
            filter: 'tag:[hash-member]+visibility:members',		
            include: 'tags,authors',
            formats: ['html'],
            order: 'published_at DESC'
        });

        await Promise.all(posts.map(async (post) => {
            let content = post.html;
            
            const frontmatter = {
                title: post.meta_title || post.title,
                description: post.meta_description || post.excerpt,
                pagetitle: post.title,
                slug: post.slug,
                image: post.feature_image,	
		image_credit: post.feature_image_caption,    
                lastmod: post.updated_at,
                date: post.published_at,
                excerpt: post.excerpt,  
		og_title: post.og_title || post.meta_title || post.title, 
		og_description: post.og_description || post.meta_description || post.excerpt,
		twitter_title: post.twitter_title || post.meta_title || post.title, 
		twitter_description: post.twitter_description || post.meta_description || post.excerpt,		    
                i18nlanguage: 'en', // Change for your language
                weight: post.featured ? 1 : 0,
                draft: post.visibility !== 'members',
            };	

            // The format of og_image is /content/images/2020/04/social-image-filename.jog
            // without the root of the URL. Prepend if necessary.
            let ogImage = post.og_image || post.feature_image || '';
            if (!ogImage.includes('https://www.alanchatfield.ghost.io')) {
                ogImage = 'https://marketingviatechnology.com' + ogImage
            }
            frontmatter.og_image = ogImage;

            if (post.tags && post.tags.length) {
                frontmatter.tags = post.tags.filter(t => t.name != '#member').filter(t => t.name != '#crmtdigital').map(t => t.name);
            }

            // If there's a canonical url, please add it.
            if (post.canonical_url) {
                frontmatter.canonical = post.canonical_url;
            }

            // Create frontmatter properties from all keys in our post object
            const yamlPost = await yaml.dump(frontmatter);

            // Super simple concatenating of the frontmatter and our content
            const fileString = `---\n${yamlPost}\n---\n${content}\n`;

            // Save the final string of our file as a Markdown file
            await fs.writeFile(path.join('content/news', `${post.slug}.md`), fileString, { flag: 'w' });
        }));

    console.timeEnd('All marketing posts converted to Markdown in');
    } catch (error) {
        console.error(error);
    }

    console.time('All public marketing posts converted to Markdown in');

    try {
        // Fetch  posts from the Ghost Content API
        const posts = await api.posts.browse({
            limit: '1',
            filter: 'tag:[hash-member]+visibility:public+published_at:<=now-14d',		
            include: 'tags,authors',
            formats: ['html'],
            order: 'published_at ASC'
        });

        await Promise.all(posts.map(async (post) => {
            let content = post.html;
            
            const frontmatter = {
                title: post.meta_title || post.title,
                description: post.meta_description || post.excerpt,
                pagetitle: post.title,
                slug: post.slug,
                image: post.feature_image,	
		image_credit: post.feature_image_caption,    
                lastmod: post.updated_at,
                date: post.published_at,
                excerpt: post.excerpt,  
		og_title: post.og_title || post.meta_title || post.title, 
		og_description: post.og_description || post.meta_description || post.excerpt,
		twitter_title: post.twitter_title || post.meta_title || post.title, 
		twitter_description: post.twitter_description || post.meta_description || post.excerpt,		    
                i18nlanguage: 'en', // Change for your language
                weight: post.featured ? 1 : 0,
                draft: post.visibility !== 'public',
            };	

            // The format of og_image is /content/images/2020/04/social-image-filename.jog
            // without the root of the URL. Prepend if necessary.
            let ogImage = post.og_image || post.feature_image || '';
            if (!ogImage.includes('https://www.alanchatfield.ghost.io')) {
                ogImage = 'https://marketingviatechnology.com' + ogImage
            }
            frontmatter.og_image = ogImage;

            if (post.tags && post.tags.length) {
                frontmatter.tags = post.tags.filter(t => t.name != '#member').filter(t => t.name != '#crmtdigital').map(t => t.name);
            }

            // If there's a canonical url, please add it.
            if (post.canonical_url) {
                frontmatter.canonical = post.canonical_url;
            }

            // Create frontmatter properties from all keys in our post object
            const yamlPost = await yaml.dump(frontmatter);

            // Super simple concatenating of the frontmatter and our content
            const fileString = `---\n${yamlPost}\n---\n${content}\n`;

            // Save the final string of our file as a Markdown file
            await fs.writeFile(path.join('content/news', `${post.slug}.md`), fileString, { flag: 'w' });
        }));

    console.timeEnd('All public marketing posts converted to Markdown in');
    } catch (error) {
        console.error(error);
    }	

    console.time('All opinion posts converted to Markdown in');
    try {
        // Fetch  posts from the Ghost Content API
        const posts = await api.posts.browse({
            limit: 'all',
            filter: 'tag:[hash-chatpress]',		
            include: 'tags,authors',
            formats: ['html'],
            order: 'published_at DESC'
        });

        await Promise.all(posts.map(async (post) => {
            let content = post.html;
            
            const frontmatter = {
                title: post.meta_title || post.title,
                description: post.meta_description || post.excerpt,
                pagetitle: post.title,
                slug: post.slug,
                image: post.feature_image,	
		image_credit: post.feature_image_caption,    
                lastmod: post.updated_at,
                date: post.published_at,
                excerpt: post.excerpt,
		relcanonical: post.canonical_url,    
		og_title: post.og_title || post.meta_title || post.title, 
		og_description: post.og_description || post.meta_description || post.excerpt,
		twitter_title: post.twitter_title || post.meta_title || post.title, 
		twitter_description: post.twitter_description || post.meta_description || post.excerpt,		    
                i18nlanguage: 'en', // Change for your language
                weight: post.featured ? 1 : 0,
                draft: post.visibility !== 'public',
		sitemap: {
			disable: true
		}		    
            };	

            // The format of og_image is /content/images/2020/04/social-image-filename.jog
            // without the root of the URL. Prepend if necessary.
            let ogImage = post.og_image || post.feature_image || '';
            if (!ogImage.includes('https://www.alanchatfield.ghost.io')) {
                ogImage = 'https://marketingviatechnology.com' + ogImage
            }
            frontmatter.og_image = ogImage;

            if (post.tags && post.tags.length) {
                frontmatter.tags = post.tags.filter(t => t.name != '#chatpress').map(t => t.name);
            }

            // If there's a canonical url, please add it.
            if (post.canonical_url) {
                frontmatter.canonical = post.canonical_url;
            }

            // Create frontmatter properties from all keys in our post object
            const yamlPost = await yaml.dump(frontmatter);

            // Super simple concatenating of the frontmatter and our content
            const fileString = `---\n${yamlPost}\n---\n${content}\n`;

            // Save the final string of our file as a Markdown file
            await fs.writeFile(path.join('content/opinion', `${post.slug}.md`), fileString, { flag: 'w' });
        }));

    console.timeEnd('All opinion posts converted to Markdown in');
    } catch (error) {
        console.error(error);
    }
	
    console.time('All pages converted to Markdown in');	
    try {
        // Fetch pages from the Ghost Content API
        const pages = await api.pages.browse({
            limit: 'all',
            filter: 'tag:-[hash-category,hash-member]',
            formats: ['html'],
        });

        await Promise.all(pages.map(async (page) => {
            let content = page.html;
            
            const frontmatter = {
                title: page.meta_title || page.title,
                description: page.meta_description || page.excerpt,
                pagetitle: page.title,
                slug: page.slug,
                image: page.feature_image,
                lastmod: page.updated_at,
                date: page.published_at,
                excerpt: page.excerpt,
		og_title: page.og_title || page.meta_title || page.title, 
		og_description: page.og_description || page.meta_description || page.excerpt,
		twitter_title: page.twitter_title || page.meta_title || page.title, 
		twitter_description: page.twitter_description || page.meta_description || page.excerpt,			    
                i18nlanguage: 'en', // Change for your language
                weight: page.featured ? 1 : 0,
                draft: page.visibility !== 'public',
            };

            // The format of og_image is /content/images/2020/04/social-image-filename.jog
            // without the root of the URL. Prepend if necessary.
            let ogImage = page.og_image || page.feature_image || '';
            if (!ogImage.includes('https://www.alanchatfield.ghost.io')) {
                ogImage = 'https://marketingviatechnology.com' + ogImage
            }
            frontmatter.og_image = ogImage;

            // If there's a canonical url, please add it.
            if (page.canonical_url) {
                frontmatter.canonical = page.canonical_url;
            }

            // Create frontmatter properties from all keys in our page object
            const yamlpage = await yaml.dump(frontmatter);

            // Super simple concatenating of the frontmatter and our content
            const fileString = `---\n${yamlpage}\n---\n${content}\n`;

            // Save the final string of our file as a Markdown file
            await fs.writeFile(path.join('content', `${page.slug}.md`), fileString, { flag: 'w' });
        }));

    console.timeEnd('All pages converted to Markdown in');
    } catch (error) {
        console.error(error);
    }
    console.time('All tags converted to Markdown in');	
    try {
        // Fetch tags from the Ghost Content API
        const tags = await api.tags.browse({
            limit: 'all',
            filter: 'visibility:public'
        });

        await Promise.all(tags.map(async (tag) => {
            let tagname = tag.name;
            tagname = tagname.toLowerCase();
            tagname = tagname.replace(" ","-");
		
            const frontmatter = {
                title: tag.name,
                description: tag.description,
                image: tag.feature_image,
		type: 'posts',
		banner: 'dark',
                i18nlanguage: 'en', // Change for your language
                draft: tag.visibility !== 'public',
		sitemap: {
		    disable: false
		}
            };

            let accentColor = tag.accent_color || '';	
            if (accentColor == "#00578A") {
                frontmatter.slug = "opinion/" + tag.slug;
		frontmatter.sitemap.disable = true;  
            } else {		    
                frontmatter.slug = tag.slug;		    
            }		    
		
            if (tag.og_title) {
                frontmatter.og_title = tag.og_title
            }		

            if (tag.og_description) {
                frontmatter.og_description = tag.og_description
            }

            // The format of og_image is /content/images/2020/04/social-image-filename.jog
            // without the root of the URL. Prepend if necessary.
            let ogImage = tag.og_image || tag.feature_image || '';
            if (!ogImage.includes('https://www.alanchatfield.ghost.io')) {
                ogImage = 'https://marketingviatechnology.com' + ogImage
            }
            frontmatter.og_image = ogImage;

            // If there's a canonical url, please add it.
            if (tag.canonical_url) {
                frontmatter.canonical = tag.canonical_url;
            }

            // Create frontmatter properties from all keys in our tag object
            const yamltag = await yaml.dump(frontmatter);

            // Super simple concatenating of the frontmatter and our content
            const fileString = `---\n${yamltag}\n---`;
            const dir = path.join('content', 'tags', `${tagname}`);
			
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir);
            }			

            // Save the final string of our file as a Markdown file
            await fs.writeFile(path.join('content', 'tags', `${tagname}`, '_index.md'), fileString, { flag: 'w' });
        }));

    console.timeEnd('All tags converted to Markdown in');
    } catch (error) {
        console.error(error);
    }	
};

module.exports = createMdFilesFromGhost();
