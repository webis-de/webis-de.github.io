# Webis Website

The website is built using [Jekyll](https://jekyllrb.com/docs/).

To install Jekyll, run

    sudo apt install ruby ruby-dev build-essential
    sudo gem install jekyll

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
- `_layouts` The actual website templates
- `_maintenance` Maintenance scripts
- `_sass` Sass source files for the website's CSS
- `_site` Compiled HTML output files (not included in the repository)
- `_src_data` Source data such as `.bib` files for generating the BibHTML
- `css` Main Sass file and additional CSS
- `img/fonts/js` Image, fonts, and JavaScript files

Other folders not starting with an underscore are content folders containing
HTML content files. 

## Update Publications
To update the publications page, change into the `_maintenance` folder and
run

    ./bib2html.sh

Then add, commit, and push the changed files. If you get an error message
due to the `php` command not being found, install it via

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
to `js/thirdparty`. You do not (and should not) add `node_modules` directly
to the Git repository.

