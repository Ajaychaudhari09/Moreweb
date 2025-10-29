
import asyncio
from playwright.async_api import async_playwright

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()
        await page.goto("http://localhost:3000")

        # Hover over Blog and take a screenshot
        await page.hover('text="Blog"')
        await page.screenshot(path="jules-scratch/verification/blog_dropdown_updated.png")

        await browser.close()

asyncio.run(main())
