<template>
  <div class="">
    <div
      v-if="bodyHtml"
      class="words contentWrapper content"
      v-html="bodyHtml"
    ></div>

    <div
      v-if="!bodyHtml"
      class="words contentWrapper content measure"
      v-html="bodyMarkdown"
    ></div>
  </div>
</template>

<style></style>

<script>
import cheerio from 'cheerio'
import URL from 'url-parse'
// import _ from 'lodash'
// import marked from 'marked'
import truncate from 'truncate'
import slugify from 'slugify'
export default {
  data: function () {
    return {
      bodyHtml: null,
    }
  },
  props: {
    bodyMarkdown: String,
    // bodyHtml: String
  },
  computed: {},
  created: function () {
    const parsedMarkdown = this.parseMarkdown(this.bodyMarkdown)
    this.bodyHtml = this.processMarkdownHtml(parsedMarkdown)
  },
  methods: {
    processMarkdownHtml: function (markdownHtml) {
      // Load parsed markdown into cheerio so we can do
      // jquery-style manipulations on the HTML
      const $ = cheerio.load(markdownHtml)

      // Remove to-level header if it is the first element
      // This prevents repeating the page title
      const firstTitle = $('h1').first()
      if (firstTitle[0]) {
        if (!firstTitle[0].prev) firstTitle.remove()
      }

      $('h1, h2, h3, h4, h5').each(function (i, el) {
        const headerID = $(el).text()
        const encodedHeaderID = slugify(headerID)
        $(el).attr('id', encodedHeaderID)
      })

      $('iframe').each(function (i, el) {
        $(el).addClass('mh3-ns')
      })
      $('p').each(function (i, el) {
        $(el).addClass('lh-copy measure pa3 pt0')
      })
      $('ul').each(function (i, el) {
        $(el).addClass('measure ph3 mv4')
      })
      $('img').each(function (i, el) {
        $(el).addClass('center mv4 pa0 pl3')
      })

      $('img').each(function (i, el) {
        if ($(el).hasClass('fullwidth')) {
          $(el).parent().removeClass('measure')
        }
      })

      $('pre').each(function (i, el) {
        $(el).addClass('pa1 bg-dark-gray white br1 mv2 pv2-ns ph3-ns')
      })
      $('code').each(function (i, el) {
        $(el).addClass('bg-dark-gray ph1 white br1 f6')
      })
      $('p > ul li').each(function (i, el) {
        $(el).addClass('mv2')
      })
      $('li > p').each(function (i, el) {
        $(el).removeClass('measure')
      })

      $('h2').each(function (i, el) {
        $(el).addClass('pl3 pb2 mb4 mt5 dark-gray')
      })
      $('h3').each(function (i, el) {
        $(el).addClass('pl3 pb2 mb2 mt4 ttu gray')
      })
      $('h4').each(function (i, el) {
        $(el).addClass('pl3 pb2 mb2 mt4 gray')
      })

      $('cite').each(function (i, el) {
        $(el).addClass('db sans-serif ttu gray tracked mt2')
      })
      $('hr').each(function (i, el) {
        $(el).addClass('center ma4 b--light-gray bt bw1')
      })
      $('blockquote').each(function (i, el) {
        $(el).addClass(
          'dark-gray mv2 f5-l ph1 ph3-ns lh-copy pl2-ns ml1 bl bw2 b--light-gray measure',
        )
      })

      $('blockquote > p').each(function (i, el) {
        $(el).removeClass('lh-copy measure center pv3 ph3-ns ph0-m ph0-l')
        $(el).addClass('i')
      })

      $('.table-of-contents')
        .first()
        .addClass('serif w-100 w-third-l f6 ma2 mh3-l fr-l pv1 ph1 bn mw5')

      $('.table-of-contents ol').addClass('w-100')

      $('.footnotes').first().addClass('')

      $('.footnote-ref a').each(function (i, el) {
        $(el).addClass('link o-50')
      })

      // If we wanted to do something special for different links
      $('a').each(function (i, el) {
        let $link = $(this)
        const linkSrc = $link.attr('href')
        const url = new URL(linkSrc)
        if (url.hostname === 'ejfox.com') {
          $link.addClass('no-underline')
          // $link.append('<small class="fas fa-angle-double-right"></small>')
        }

        if (url.hostname === 'en.wikipedia.org') {
          $link.append(
            ' <small class="fab fa-wikipedia-w font-half" style="font-size: 0.5em"></small>',
          )
        }

        if (url.hostname === 'github.com') {
          $link.append(' <small class="fab fa-github font-half"></small>')
        }

        if (url.hostname === 'twitter.com') {
          $link.append(' <small class="fab fa-twitter font-half"></small>')
        }
      })

      // Here we go through each image, which is just a link to the fullsize in the CMS
      // We build a responsive srcset and the right queries in the URL so it works well on mobile
      $('img').each(function (i, el) {
        let $image = $(this)
        const imgSrc = $image.attr('src')
        const url = new URL(imgSrc)

        // If it's a link to cloudinary, perform our operations, otherwise we leave it alone
        // c_scale,dpr_auto,w_1080,q_auto:best
        if (url.hostname === 'res.cloudinary.com') {
          // Generate SMALL image URL
          let urlS = new URL(imgSrc)
          let urlSPaths = urlS.pathname.split('/')
          urlSPaths.splice(
            urlSPaths.length - 2,
            0,
            'fl_progressive:semi,c_scale,dpr_auto,w_320',
          )
          urlS.pathname = urlSPaths.join('/')
          // Generate MEDIUM image URL
          let urlM = new URL(imgSrc)
          let urlMPaths = urlM.pathname.split('/')
          urlMPaths.splice(
            urlMPaths.length - 2,
            0,
            'fl_progressive:semi,c_scale,dpr_auto,w_920',
          )
          urlM.pathname = urlMPaths.join('/')
          // Generate LARGE image URL
          let urlL = new URL(imgSrc)
          let urlLPaths = urlL.pathname.split('/')
          urlLPaths.splice(
            urlLPaths.length - 2,
            0,
            'fl_progressive:semi,c_scale,dpr_auto,w_1280',
          )
          urlL.pathname = urlLPaths.join('/')

          let srcSet = [
            urlS.toString() + ' 320w',
            urlM.toString() + ' 920w',
            urlL.toString() + ' 1280w',
          ]

          let sizes = [
            '(max-width: 320px) 280px',
            '(max-width: 720px) 980px',
            '1000px',
          ]

          $image.attr('srcset', srcSet.join(', \n'))
          $image.attr('sizes', sizes.join(', \n'))
          $image.attr('src', urlM.toString())
          // $image.addClass('shadow-4-l')
        }
      })

      // return parsed, sliced, and diced markdown
      return $.html()
    },
    parseMarkdown: function (markdown) {
      // console.log('Parsing markdown...')
      // Build markdown parser
      // const markdownRenderer = marked.setOptions({
      //   renderer: new marked.Renderer(),
      //   // highlight: function (code) {
      //   //   return require('highlight.js').highlightAuto(code).value
      //   // }
      //   pedantic: false,
      //   gfm: true,
      //   tables: true,
      //   breaks: false,
      //   smartLists: true,
      //   smartypants: true,
      //   xhtml: true
      // })
      // return markdownRenderer(markdown)

      // console.log('markdown-it-footnote', require('markdown-it-footnote'))

      // console.log('markdown-it-anchor', require('markdown-it-anchor').default)

      const MarkdownIt = require('markdown-it')({
        html: true,
        breaks: true,
        typographer: true,
      })
        .use(require('markdown-it-footnote'))
        //.use(require('../../helpers/footnote.js'))
        .use(require('markdown-it-table-of-contents'), {
          includeLevel: [2, 3],
          listType: 'ol',
          slugify: slugify,
          containerHeaderHtml: `<h4 class="ttu tc f4 f3-ns">Table of Contents</h4>`,
        })
        .use(require('markdown-it-strikethrough-alt'))

      return MarkdownIt.render(markdown)
    },
  },
}
</script>

<style>
.font-half {
  font-size: 0.5em;
}

.table-of-contents {
}

.footnote-ref {
  /* font-family: 'Helvetica Neue', Helvetica, arial, sans-serif; */
}

.footnotes {
  font-size: 0.85em;
  line-height: 1em;
  margin-bottom: 12vh;
}
.footnotes-sep {
  margin-top: 12vh;
  margin-bottom: 12vh;
}
a.header-anchor,
a.markdownIt-Anchor {
  color: #999 !important;
  text-decoration: none;
  opacity: 0.3;
  position: absolute;
  left: 1vw;
  font-size: 15px;
}

li li, li ol {
  list-style-type: none;
  margin: 0;
  padding: 0;
  margin-left: 0.4em;
  margin-bottom: 0.4em;
}

li {
  margin-top: 0.5em;
  margin-bottom: 0.5em;
}
/* 
img {
  width: 100%;
  max-height: 100vh;
  object-fit: contain;
} */
</style>
