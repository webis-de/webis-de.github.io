# Webis Website

The website is built using [Jekyll](https://jekyllrb.com/docs/).

To install Jekyll, run

    sudo apt install ruby ruby-dev build-essential
    sudo gem install jekyll jekyll-sitemap

Once Jekyll is installed, you can `cd` into the main folder of this repository
and run

    jekyll serve

This will start a server at [http://localhost:4000/]() serving the compiled
website. If the source files change, the server will automatically recompile
them. The server can be stopped via `Ctrl+C`.

To publish changes to the source files, just push them to GitHub, which will
take care of compiling them on its own.

## Sources Structure
- `_includes` Includes to other source files (e.g. BibHTML)
- `_layouts` The website's layout templates
- `_maintenance` Maintenance scripts
- `_sass` Sass source files for the website's CSS
- `_site` Compiled HTML output files (not included in the repository)
- `_src_data` Source data such as `.bib` files for generating the BibHTML
- `css` Main Sass file and additional CSS
- `img`, `fonts`, `js` Image, fonts, and JavaScript files

Other folders not starting with an underscore are content folders containing
HTML content files.

## Edit HTML
To edit the website's HTML, simply edit the `.html` content file you want to change. There is
nothing special to this, except that you can (!) use
[Jekyll's Liquid tags](https://jekyllrb.com/docs/templates/) and that each source file
starts with a YAML front matter. The latter is just a bunch of arbitrary variable
definitions, but should at least (but doesn't have to) include the following:

    ---
    layout: default
    nav_active: id
    title: The page title
    description: A meta description
    ---

The only thing special is `nav_active`, which determines which entry in the navigation should
be highlighted as active. The placeholder `id` can be any of `index`, `people`,
`lecturenotes`, `research`, `publications`, `data`, `facilities`, or `events`.

If you want an HTML page without any layout, omit `layout` (or change it to a custom layout
which you put in `_layouts` before).

If you need extra (external) CSS files within a page, specify their paths with

    additional_css: [ 'file1.css', 'file2.css', '...' ] 

## Edit CSS
CSS is managed via Sass, which is automatically compiled by Jekyll.
The main SCSS file is located at `css/style.scss`. This file is only there to
include all other fragments and you hardly ever need to touch it. The fragments
themselves are under `_sass`. Feel free to edit them any way you want, but please do
NOT edit anything under `_sass/uikit`. Any changes there will be overwritten
next time UIkit is updated. Instead, if you want to modify the value of a layout
variable, look for its name in `_sass/uikit/variables.scss` and redefine it in
`_sass/_variables.scss`.

## Update Publications
To update the publications page, change into the `_maintenance` folder and
run

    ./bib2html.sh

Then add, commit, and push the changed files. If you get an error message
that the `php` command could not be found, install it via

    sudo apt install php

and run the script again.

## Update Third-party Dependencies
Third-party dependencies (UIkit, jQuery, etc.) are managed via NPM/Yarn.
Unless you want to update them or need to add new dependencies, you don't
have to touch them.

To install NPM, run

    apt install npm

If you prefer Yarn (not to be confused with Apache Yarn), run

    curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
    echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list
    sudo apt update && sudo apt install yarn

Once the installation has finished, change into the `_maintenance` folder
and run

    ./update-dependencies.sh

Then add, commit, and push the changed files. The script will check out the
dependencies via `yarn` or `npm` (whichever is installed) into a folder
called `node_modules` and copy all the files needed for operating the website
to `js/thirdparty` and `_sass/uikit`. Please do not add `node_modules` directly
to the Git repository.
