/* eslint-disable no-console */
import axios from "axios";
import cheerio from 'cheerio';
import type { Cheerio, CheerioAPI, Element } from "cheerio";

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
    });
}).catch((error) => {
    console.error(error);
});
