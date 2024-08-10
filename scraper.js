const puppeteer = require("puppeteer");

function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function runScraper() {
    const browser = await puppeteer.launch({headless: false, ignoreHTTPSErrors: true, args: ["--no-sandbox"]});

    try {
        const page = await browser.newPage();
        await page.setViewport({width: 1280, height: 800});
        await page.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3419.0 Safari/537.36");

        page.on('dialog', async dialog => {
            console.log(dialog.message());
            await dialog.accept();
        });
        await page.goto("https://internshala.com/", {
            waitUntil: ['networkidle2'], timeout: 16000000
        });
        await timeout(2000);
        await page.click("#header > div > nav > div.nav-cta-container > button.login-cta")
        await page.type("#modal_email", "pranvirai3120@gmail.com");
        await page.type("#modal_password", "sk260670");
        await page.click("#modal_login_submit");
        await page.waitForNavigation(60000);
        await page.goto("https://internshala.com/internships/work-from-home-internships/part-time-true/", {
            waitUntil: ['networkidle2'], timeout: 16000000
        });
        await page.click("#select_category_chosen > ul > li > input");
        await page.type("#select_category_chosen > ul > li > input","Node.js Development");
        await page.keyboard.press("Enter");
        await timeout(5000);
        await page.click("#select_category_chosen > ul > li > input");
        await page.type("#select_category_chosen > ul > li > input","Full Stack Development");
        await page.keyboard.press("Enter");
        const pageUrl = 'https://internshala.com/internships/work-from-home-full-stack-development,node-js-development-internships/part-time-true//';
        await timeout(5000);
        let jobUrl = await page.evaluate(() => {
            const container = document.querySelector('#internship_list_container_1'); // Replace with your actual container selector
            if (!container) {
                return [];
            }
            const internships = container.querySelectorAll('.individual_internship');

            const jobList = [];

            internships.forEach((internship) => {
                const href = internship.getAttribute('data-href');
                const id = internship.getAttribute('id');
                const nameElement = internship.querySelector('h3.job-internship-name');
                const name = nameElement ? nameElement.textContent.trim() : null;
                const companyElement = internship.querySelector('p.company-name');
                const company = companyElement ? companyElement.textContent.trim() : null;

                if (name && company) {
                    jobList.push({ href, id, name, company });
                }
            });

            return jobList;
        });

        jobUrl.splice(5,jobUrl.length);
        console.log(jobUrl)
        for await (let job of jobUrl) {
            let url = job.id;
            if (url) {
                console.log('Navigating to job page '+ job.name);
                await page.waitForSelector(`#${url}`)
                await page.click(`#${url}`);
                await timeout(3000);

                if(await page.$('#continue_button')){
                    await page.click(`#continue_button`);
                }

                if(await page.$('#is_distance_learning')) {
                    await page.click('#is_distance_learning');
                }
                await timeout(2000);

                if(await page.$('#cover_letter_holder > div.ql-editor.ql-blank')){
                    await page.type('#cover_letter_holder > div.ql-editor.ql-blank',
                        `I am writing to express my interest in the Web Development Internship position at ${job.company ? job.company : "Your Company" } . With a strong foundation in front-end and back-end technologies, a passion for creating user-friendly web experiences, and a commitment to continuous learning, I am excited about the opportunity to contribute to your team.\n
    I am currently pursuing a B.Tech in computer science at LNMIIT, where I have developed a solid understanding of web development principles and best practices. Additionally, I have hands-on experience with HTML, CSS, JavaScript, and various web development frameworks such as React and Node.js.\n
    During a recent project, I worked on building a website to streamline hall booking process in my college using the MERN tech stack. This experience honed my skills in problem-solving while deepening my understanding of user-centered design.\n
    I am eager to contribute to your team by applying my skills and learning from the talented professionals in the company. I am confident that my enthusiasm, technical skills, and dedication will allow me to make a meaningful contribution to your projects. Thank you for considering my application. I look forward to the possibility of contributing to the company\'s growth.`);
                }
                if(await page.$('#submit')){
                    console.log('Submit Button Founded')
                     await page.click(`#submit`);
                }
                await timeout(4000);
                await page.goto(pageUrl, {
                    waitUntil: ['networkidle2'], timeout: 16000000
                });
                await timeout(4000);
            }
            else {
                console.log('URL not found');
            }
        }


    } catch (err) {
        console.error('Error running scraper:', err);
    } finally {
        await browser.close();
    }
}

module.exports = { runScraper };
