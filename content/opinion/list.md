---
title: "News & Current Affairs"
description: "Random asides and other off-topic thoughts about sport, politics and global affairs"
image: "https://source.unsplash.com/YLSwjSy7stw/1920x1080"
banner: dark
type: "list"
url: /opinion
---
{{ define "main" }}

{{ partial "banner" (dict "imageUrl" .Params.image "title" .Title "subtitle" .Params.Description "bannerStyle" .Params.banner) }}

<main class="container">
      {{ $pages := (where (or (index .Site.Taxonomies.tags "politics") (index .Site.Taxonomies.tags "sport") (index .Site.Taxonomies.tags "asides"))) }}
				{{ $paginator := .Paginate $pages 19 }}	
				{{ range $paginator.Pages.ByPublishDate.Reverse }}
            {{ .Render "li"}}
      {{ end }}
  {{ partial "pagination" . }}
</main>

{{end}}
