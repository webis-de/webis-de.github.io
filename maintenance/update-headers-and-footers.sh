#!/bin/bash

echo "Updating the header and footer of all HTML files in the repository according to the header and footer of the index.html"

if [ $# -gt 1 ]
then
  echo "Usage:"
  echo "  $0"
  echo "  $0 <path/to/webis-de.github.io>"
  echo "If no argument is given, assumes that this script lies in webis-de.github.io/maintenance and go from there."
  exit 1
fi
git_directory=$1
if [ $# -eq 0 ];then
  git_directory=$(dirname $0)/..
fi

pushd $git_directory > /dev/zero
if [ $(basename $(pwd)) != "webis-de.github.io" ]
then
  echo "Not webis-de.github.io: $git_directory" > /dev/stderr
  echo "Provide the path to webis-de.github.io as argument to the script" > /dev/stderr
  exit 2
fi

echo "Using git directory $(pwd)"

index_file=index.html
other_html_files=$(find -name '*.html' | grep -v "^\./index.html")

gawk 'BEGIN {
    header_start = "<!-- header start -->"
    header_end   = "<!-- header end -->"
    footer_start = "<!-- footer start -->"
    footer_end   = "<!-- footer end -->"
    first_level_directory = 2
    second_level_directory = 3
  } function remove_class(text, id, class) {
    return gensub("(id=\"nav-item-"id"\" [^>]*class=\")([^\"]* )?"class"( [^\"]*)?\"", "\\1\\2\\3\"", 1, text)
  } function add_class(text, id, class) {
    return gensub("(id=\"nav-item-"id"\" [^>]*class=\"[^\"]*)\"", "\\1 "class"\"", 1, text)
  } function adjust_active(text, target_file) {
    text = remove_class(text, "home", "active")
    directory_level = split(target_file, path_parts, "/") - 2
    text = add_class(text, path_parts[first_level_directory], "active")
    if (directory_level > 1) {
      text = add_class(text, path_parts[first_level_directory]"-"path_parts[second_level_directory], "active")
      filename = gensub("\.html", "", 1, path_parts[second_level_directory + 1])
      if (path_parts[second_level_directory] != filename) {
        text = add_class(text, path_parts[first_level_directory]"-"path_parts[second_level_directory]"-"filename, "active")
      }
    }
    return text
  } function adjust_links(text, target_file) {
    text = remove_class(text, "home", "active")
    directory_level = split(target_file, path_parts, "/") - 2

    if (directory_level == 1) {
      # links to this file
      text = gensub("(src|href)=\""path_parts[first_level_directory]"/"path_parts[first_level_directory+1]"\"", "\\1=\"#\"", "g", text)
      # other links
      text = gensub("(src|href)=\"([^.\"/#][^\":]*)\"", "\\1=\"../\\2\"", "g", text)
    } else {
      # links to this file
      text = gensub("(src|href)=\""path_parts[first_level_directory]"/"path_parts[second_level_directory]"/"path_parts[second_level_directory+1]"\"", "\\1=\"#\"", "g", text)
      # links with same parent directory
      text = gensub("(src|href)=\""path_parts[first_level_directory]"/([^\"]*)\"", "\\1=\"../\\2\"", "g", text)
      # other links
      text = gensub("(src|href)=\"([^.\"#/][^\":]*)\"", "\\1=\"../../\\2\"", "g", text)
    }

    return text
  } {
    if (FILENAME == "'$index_file'") {
      if ($0 == header_start) {
        print "Reading header of "FILENAME
        read_header = 1
        header = header_start
      } else if (read_header) {
        header = header"\n"$0
      }
      if ($0 == header_end) {
        read_header = 0
      }

      if ($0 == footer_start) {
        print "Reading footer of "FILENAME
        read_footer = 1
        footer = footer_start
      } else if (read_footer) {
        footer = footer"\n"$0
      }
      if ($0 == footer_end) {
        read_footer = 0
      }
    } else { # FILENAME != $index_file
      output = FILENAME".tmp"
      if ($0 == header_start) {
        skip = 1
        print "Writing header for "FILENAME
        print adjust_links(adjust_active(header, FILENAME), FILENAME) > output
      }
      if ($0 == footer_start) {
        skip = 1
        print "Writing footer for "FILENAME
        print adjust_links(footer, FILENAME) > output 
      }
      if (skip != 1) {
        print $0 > output
      }
      if ($0 == header_end || $0 == footer_end) {
        skip = 0
      }
    }
  }' $index_file $other_html_files

for other_html_file in $other_html_files;do
  mv $other_html_file.tmp $other_html_file
done

popd > /dev/zero # $git_directory

