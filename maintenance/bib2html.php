<?php
// DATE. October 9th, 2017

$bibentries = new Bibentries();
$resourcesBase = "publications";
// read
foreach ($argv as $bib_file) {
    if (basename($bib_file) != basename(__FILE__)) {
        $bibentries->addBib($bib_file);
        if ($bib_file == "pub-theses-we.bib") {
            $resourcesBase = "weimar";
        }
    }
}

// sort
uksort($bibentries->entries, 'compare_keys');
function compare_keys($key1, $key2)
{
    $year1 = substr($key1, strpos($key1, ":") + 1);
    $year2 = substr($key2, strpos($key2, ":") + 1);
    return -strcmp($year1, $year2);
}


$downloadsHref = "https://webis.de/downloads";
// get which resources exist in the repository
function get_existing_href()
{
    global $resourcesBase;

    $context = stream_context_create(array("http" => [
        "header" => "Accept: application/vnd.github.v3+json\r\n" .
            "User-Agent: webis-de\r\n"
    ]));

    $trees = json_decode(file_get_contents("https://api.github.com/repos/webis-de/downloads/git/trees/master",
        false, $context));
    $url = false;
    foreach ($trees->tree as $tree) {
        if ($tree->path === $resourcesBase) {
            $url = $tree->url;
            break;
        }
    }

    if ($url) {
        $data = json_decode(file_get_contents($url . "?recursive=1", false, $context));
        $hrefs = array();
        foreach ($data->tree as $entry) {
            $hrefs[$entry->path] = 1;
        }
        return $hrefs;
    } else {
        error_log("Did not find tree for " . $resourcesBase);
        exit(1);
    }
}

$existingHrefs = get_existing_href();

// print
echo '{% raw %}' . "\n";

$lastEntryYear = "";
foreach ($bibentries->entries as $key => $entry) {
    $year = substr($key, strpos($key, ":") + 1, 4);
    if ($year != $lastEntryYear) {
        if ($lastEntryYear != "") {
            echo '</div>' . "\n";
        }
        echo '<div id="year-' . $year . '" class="year-entry">' . "\n";
        echo '  <h2 class="year">' . $year . '</h2>' . "\n";
    }
    $bibentries->printEntry($key);
    $lastEntryYear = $year;
}
echo '</div>' . "\n" . '{% endraw %}'. "\n";

function trim_value(&$value)
{
    $value = trim($value);
}

class Bibentries
{
    public static $downloadsHref = "https://webis.de/downloads/";
    public static $paperRequestSubject = "?subject=Request%20file%20of%20publication%20";

    public static $month_names = array(
        "jan" => "January",
        "feb" => "February",
        "mar" => "March",
        "apr" => "April",
        "may" => "May",
        "jun" => "June",
        "jul" => "July",
        "aug" => "August",
        "sep" => "September",
        "oct" => "October",
        "nov" => "November",
        "dec" => "December");

    public static $escapeseq = array(
        "``" => "\"",
        "''" => "\"",
        "\\ " => " ",
        "\\-" => "",
        "\\@" => "@",
        "\\&" => "&",
        "\\'a" => "&aacute;",
        "\\'A" => "&Aacute;",
        "\\`a" => "&agrave;",
        "\\\"a" => "&auml;",
        "\\\"A" => "&Auml;",
        "\\c c" => "&ccedil;",
        "\\c C" => "&Ccedil;",
        "\\c s" => "&#351;",
        "\\c t" => "&#355;",
        "\\d S" => "&#7778;",
        "\\'e" => "&eacute;",
        "\\'E" => "&Eacute;",
        "\\`e" => "&egrave;",
        "\\H u" => "&#369;",
        "\\\"i" => "&#239;",
        "\\'i" => "&iacute;",
        "\\i" => "&#305;",
        "\\l" => "&#322;",
        "---" => "&mdash;",
        "~" => "&nbsp;",
        "--" => "&ndash;",
        "\\'n" => "&nacute;",
        "\~n" => "&ntilde;",
        "\\'o" => "&oacute;",
        "\\'O" => "&Oacute;",
        "\\\"o" => "&ouml;",
        "\\\"O" => "&Ouml;",
        "\\sc" => "",
        "\\'s" => "&sacute;",
        "\\'S" => "&Sacute;",
        "\\ss" => "&szlig;",
        "\\textsc" => "",
        "\\u a" => "&#259;",
        "\\u g" => "&#287;",
        "\\'u" => "&uacute;",
        "\\`u" => "&ugrave;",
        "\\\"u" => "&uuml;",
        "\\\"U" => "&Uuml;",
        "\\v c" => "&#269;",
        "\\v r" => "&#345;",
        "\\v S" => "&Scaron;",
        "\\v s" => "&scaron;",
        "\\'y" => "&yacute;"
    );

    function Bibtex()
    {
        $this->entries = array();
    }

    function addBib($file)
    {
        if (!is_file($file))
            die;
        $fid = fopen($file, 'r');
        $this->parse($fid);
        fclose($fid);
    }

    function cleanValue($value)
    {
        $value = ltrim($value);
        $value = rtrim($value, ',');

        $value = strtr($value, array('}' => '', '{' => ''));
        $value = strtr($value, self::$escapeseq);
        $value = rtrim($value, '.');

        return $value;
    }

    function parse($fid)
    {
        while ($line = fgets($fid)) {
            $plainline = $line;
            $line = trim($line);
            if (strpos($line, '@') === 0) {
                $n = sscanf($line, '@%[^{]{%[^,],', $class, $bibkey);
                $this->entries[$bibkey] = array("class" => strtolower($class));
                $this->entries[$bibkey]['plain'] = $plainline;
            } else if (($pos = strpos($line, '=')) !== false) {
                $key = strtolower(trim(substr($line, 0, $pos)));
                $value = trim(substr($line, $pos + 1));
                $value = $this->cleanValue($value);
                $this->entries[$bibkey][$key] = $value;
                // annotations, links, and labels not shown in bibtex
                if (!in_array($key, array('annote', 'request')) and !(strpos($key, 'label-') === 0) and !(strpos($key, 'link-') === 0)) {
                    $this->entries[$bibkey]['plain'] .= $plainline;
                }
            } else if (isset($bibkey)) {
                $this->entries[$bibkey]['plain'] .= trim($plainline);
                if (strpos($line, '}') === 0) {
                    unset($bibkey);
                }
            }
        }
    }

    function wrap($tag, $attributes, $content)
    {
        $attrstr = '';
        foreach ($attributes as $key => $value) {
            $attrstr = $attrstr . sprintf(' %s="%s"', $key, $value);
        }
        return sprintf('<%s%s>%s</%s>', $tag, $attrstr, $content, $tag);
    }

    function printPlainEntry($bibkey)
    {
        if (!isset($this->entries[$bibkey])) {
            echo('Bibentry not yet available.');
        } else {
            echo($this->entries[$bibkey]['plain']);
        }
    }

    function buildBibKeyByFilename($filename)
    {
        // extract bibkey based on filename
        $info = pathinfo($filename);
        $bibkey = basename($filename, '.' . $info['extension']);
        $bibkey = str_replace('_', ':', $bibkey);
        return $bibkey;
    }

    /**
     *   \brief test if bibkey is aviable
     **/
    function hasBibEntry($bibkey)
    {
        return isset($this->entries[$bibkey]);
    }

    function hasBibEntryByFilename($filename)
    {
        $bibkey = $this->buildBibKeyByFilename($filename);
        return $this->hasBibEntry($bibkey);
    }

    function getHrefIfExists($path, $bibid)
    {
        global $existingHrefs, $resourcesBase, $downloadsHref;
        $filename = $path . "/" . $bibid . ".pdf";
        if (isset($existingHrefs[$filename])) {
            return $downloadsHref . "/" . $resourcesBase . "/" . $filename;
        } else {
            return false;
        }
    }

    function printEntry($bibkey)
    {
        if (!isset($this->entries[$bibkey])) {
            echo "Missing bibkey: " . $bibkey;
            return;
        }

        $bibkeyclean = str_replace(":", "_", $bibkey);
        $bibid = str_replace(':', '_', $bibkey);

        $entry = $this->entries[$bibkey];
        $linkclass = 'paper';
        $divAttributes = array();

        $hrefThesis = $this->getHrefIfExists('teaching/theses/', $bibid);
        $hrefThesisSlides = $this->getHrefIfExists('teaching/thesis-slides/', $bibid);
        $hrefPapers = $this->getHrefIfExists('papers', $bibid);
        $hrefPosters = $this->getHrefIfExists('posters', $bibid);
        $hrefSlides = $this->getHrefIfExists('slides', $bibid);

        if ($hrefThesis) {
            $href = $hrefThesis;
            $entry['thesis'] = $hrefThesis;
            $linkclass = 'thesis';
        } else if ($hrefPapers) {
            $href = $hrefPapers;
            $entry['paper'] = $hrefPapers;
        } else if (isset($entry['corpus'])) {
            $href = $entry['corpus'];
            $linkclass = 'corpus';
        } else if (isset($entry['request'])) {
            $href = 'mailto:' . $entry['request'] . self::$paperRequestSubject . $bibid;
            $entry['request'] = $href;
            $linkclass = 'request';
        }

        if ($hrefPosters) {
            $entry['poster'] = $hrefPosters;
        }

        if ($hrefThesisSlides) {
            $entry['slides'] = $hrefThesisSlides;
        } else if ($hrefSlides) {
            $entry['slides'] = $hrefSlides;
        }

        $bib = '[' . $this->wrap('a', array('class' => 'bib', 'onclick' => 'openBibtex(event)', 'data-target' => "bibtex-" . $bibid), 'bib') . ']';

        $title = "";
        foreach ($entry as $key => $value) {
            if ($value !== '') {
                /* Titel mit paper-Link umschließen */
                if ($key === 'title') {
                    $title = $value;
                    $divAttributes['data-title'] = $value;
                }
                /* Kurzschreibweise des Monats mit Langform ersetzen */
                if ($key === 'month') {
                    $month = $this->wrap('span', array('class' => 'month'), self::$month_names[$entry['month']]);
                    $divAttributes['data-month'] = self::$month_names[$entry['month']];
                } else if ($key === 'author' or $key === 'editor') {
                    $divAttributes['data-' . $key] = str_replace(" and ", ",", $value);
                    $authors = explode(' and ', $value);
                    array_walk($authors, 'trim_value');
                    if (sizeof($authors) > 4) {
                        ${'short' . $key} = $authors[0] . ' et al';
                    }
                    if (sizeof($authors) > 2) {
                        ${$key} = implode(', ', array_slice($authors, 0, -1)) . ', and ' . end($authors);
                    } else {
                        ${$key} = $value;
                    }
                } else if ($key === 'isbn') {
                    ${$key} = 'ISBN ' . $value;
                    $divAttributes['data-isbn'] = $value;
                } else if ($key === 'issn') {
                    ${$key} = 'ISSN ' . $value;
                    $divAttributes['data-issn'] = $value;
                } else if ($key === 'number') {
                    ${$key} = '(' . $value . ')';
                    $divAttributes['data-number'] = $value;
                } else if ($key === 'chapter') {
                    ${$key} = 'Chapter ';
                    $divAttributes['data-chapter'] = $value;
                    // give Chapter part of the entry a link to the paper
                    if (isset($href)) {
                        ${$key} .= $this->wrap('a', array('href' => $href, 'class' => $linkclass), $value);
                    } else {
                        ${$key} .= $value;
                    }
                } else if ($key === 'class') {
                    $divAttributes['data-class'] = $value;
                    ${$key} = $value;
                } else if ($key === 'url') {
                    ${$key} = '[' . $this->wrap('a', array('class' => 'publisher', 'href' => $value, 'target' => '_blank'), 'publisher') . ']';
                } else if (in_array($key, array('doi', 'paper', 'request', 'thesis', 'poster', 'slides')) or (strpos($key, 'link-') === 0)) {
                    $label = $key;
                    if ($key === 'request' and !isset($entry['paper'])) {
                        $label = 'paper';
                        if (in_array($entry['class'], array('phdthesis', 'mastersthesis'))) {
                            $label = 'thesis';
                        }
                    }
                    if (isset($entry['label' . $key])) {
                        $label = $entry['label' . $key];
                    } else if ($key === 'paper' and in_array($entry['class'], array('article', 'proceedings'))) {
                        $label = $entry['class'];
                    } else if (strpos($key, 'link-') === 0) {
                        $key = substr($key, 5);
                        $label = $key;
                    }
                    ${$key} = '[' . $this->wrap('a', array('class' => $key, 'href' => $value, 'target' => '_blank'), $label) . ']';
                } else {
                    if (in_array($key, array('year', 'volume', 'distinguished', 'publisher', 'booktitle', 'series', 'school', 'date', 'type'))) {
                        $divAttributes['data-' . $key] = $value;
                    } else if (strpos($key, 'label-') === 0) {
                        $divAttributes['data-' . substr($key, 6)] = $value;
                    }
                    ${$key} = $this->wrap('span', array('class' => $key), $value);
                }
            }
        }

        // check for inbook, because inbook entries have a title, but the paper link should be in the chapter part
        if (isset($href) && $class != "inbook") {
            $title = $this->wrap('a', array('href' => $href, 'class' => $linkclass), $title);
        }

        $date = (isset($month) ? $month . ' ' : '') . $year;

        switch ($class) {
            case 'article':
                $volumeString = sprintf(
                    '%s%s%s',
                    isset($volume) ? ' ' . $volume : '',
                    isset($number) ? ' ' . $number : '',
                    isset($pages) ? ' : ' . $pages : ''
                );
                $content = sprintf(
                    '%s. %s. %s, %s %s. %s',
                    $author,
                    $title,
                    $journal,
                    trim($volumeString) != "" ? $volumeString . "," : "",
                    $date,
                    isset($isbn) ? $isbn . '.' : ''
                );
                break;
            case 'book':
                $content = sprintf(
                    '%s. %s. %s,%s %s. %s',
                    $author,
                    $title,
                    $publisher,
                    isset($address) ? $adress . ', ' : '',
                    $year,
                    isset($isbn) ? $isbn . '.' : ''
                );
                break;
            case 'inbook':
                $content = sprintf(
                    '%s. %s. %s, pages %s %s. %s',
                    $author,
                    $title,
                    $chapter,
                    $pages,
                    $publisher,
                    $year,
                    isset($isbn) ? $isbn . '.' : ''
                );
                break;
            case 'incollection':
                $content = sprintf(
                    '%s. %s. In %s, editors, %s, pages %s. %s. %s.',
                    $author,
                    $title,
                    $editor,
                    $booktitle,
                    $pages,
                    $publisher,
                    $date,
                    $isbn
                );
                break;
            case 'inproceedings':
                $content = sprintf(
                    '%s. %s. In %s%s%s%s%s%s, %s. %s%s%s',
                    $author,
                    $title,
                    isset($editor) ? (isset($shorteditor) ? $shorteditor : $editor) . ', editors, ' : '',
                    $booktitle,
                    isset($volume) ? ' volume ' . $volume . ' of' : '',
                    isset($series) ? (isset($volume) ? ' ' : ', ') . $series : '',
                    isset($pages) ? ', pages ' . $pages : '',
                    isset($address) ? ', ' . $address : '',
                    $date,
                    isset($publisher) ? $publisher . '. ' : '',
                    isset($isbn) ? $isbn . '. ' : '',
                    isset($issn) ? $issn . '.' : ''
                );
                break;
            case 'mastersthesis':
            case 'phdthesis':
                $content = sprintf(
                    '%s. %s. %s, %s, %s.',
                    $author,
                    $title,
                    $type,
                    $school,
                    $date
                );
                break;
            case 'misc':
                $content = sprintf(
                    '%s. %s. %s, %s.',
                    $author,
                    $title,
                    $howpublished,
                    $year
                );
                break;
            case 'proceedings':
                $content = sprintf(
                    '%s%s. %s%s%s, %s. %s',
                    isset($editor) ? $editor . '. ' : '',
                    $title,
                    isset($number) ? 'number ' . $number . ' in ' : '',
                    isset($series) ? $series . '. ' : '',
                    $publisher,
                    $date,
                    isset($issn) ? $issn . '.' : ''
                );
                break;
            case 'techreport':
                $content = sprintf(
                    '%s. %s. %s%s%s%s.',
                    $author,
                    $title,
                    isset($type) ? $type . ' ' : '',
                    isset($number) ? $number . ', ' : '',
                    isset($institution) ? $institution . ', ' : '',
                    $date
                );
                break;
        }

        $content = "<a id='$bibkeyclean' class='anchor'></a>" . $content;

        $links = (isset($doi) ? $doi . ' ' : (isset($url) ? $url . ' ' : '')) .
            (isset($paper) ? $paper . ' ' : '') .
            (isset($thesis) ? $thesis . ' ' : '') .
            (isset($corpus) ? $corpus . ' ' : '') .
            (isset($request) ? $request . ' ' : '') .
            $bib .
            (isset($slides) ? ' ' . $slides : '') .
            (isset($poster) ? ' ' . $poster : '');

        foreach ($entry as $key => $value) {
            if ($value !== '') {
                if (strpos($key, 'link-') === 0) {
                    $key = substr($key, 5);
                    $links = $links . ' ' . ${$key};
                }
            }
        }

        $divAttributes['class'] = "bib-entry " . $class;
        $bibtexArea = "<textarea id='bibtex-" . $bibid . "' class='bibtex hidden' readonly>" . $entry["plain"] . "</textarea>";

        echo isset($content) ? '    ' . $this->wrap('div', $divAttributes, $content . ' ' . $links . $bibtexArea) . "\n" : '';
    }
}
