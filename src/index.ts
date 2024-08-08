/* eslint-disable no-console */
import axios from "axios";
import cheerio from 'cheerio';
import type { Cheerio, CheerioAPI, Element } from "cheerio";
import { PrismaClient } from "@prisma/client";
import type { Post } from "@prisma/client";

const prisma = new PrismaClient();

const url = "https://warontherocks.com/";
const AxiosInstance = axios.create({
    baseURL: url,
});


AxiosInstance.get("/").then((response) => {
    const html = response.data;
    const $: CheerioAPI = cheerio.load(html as string);
    const latestPostsDiv: Cheerio<Element> = $("body > div.main > div.wrapper > div.latest-posts");
    const articles: Cheerio<Element> = latestPostsDiv.find("div.box--full, div.box--half");

    articles.each((_: number, element: Element) => {
        const title = $(element).find("h2 a, h3 a").text();
        const link = $(element).find("h2 a, h3 a").attr("href");

        console.log(`Title: ${title}`);
        console.log(`Link: ${link}`);

        if (title && link) {
            writetodb({
                title,
                Url: link,
                memberonly: false,
            });
        }

    });
}).catch((error) => {
    console.error(error);
});

async function writetodb(postData: Omit<Post, 'id' | 'createdAt'>) {
    await prisma.post.upsert({
        where: { Url: postData.Url },
        update: {},
        create: postData,

    });
}



