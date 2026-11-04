# My blog: setup in 4 steps

1. **Install Quarto:** https://quarto.org/docs/get-started/

2. **Fill in placeholders:** search for `YOUR-GITHUB-USERNAME` and
   `YOUR-LINKEDIN-HANDLE` in `_quarto.yml` and `about.qmd`.
   Add a photo named `profile.jpg` in this folder (or delete the `image:` line in about.qmd).

3. **Preview locally:** in this folder, run
       quarto preview

4. **Publish to GitHub Pages:**
   - Create a GitHub repo named `YOUR-GITHUB-USERNAME.github.io`
   - Push this folder to it (main branch)
   - Run:  quarto publish gh-pages
   - In the repo: Settings -> Pages -> set the source branch to `gh-pages`

Your site will be live at https://YOUR-GITHUB-USERNAME.github.io

To publish the draft post: delete `draft: true` from its front matter, then run
`quarto publish gh-pages` again.
