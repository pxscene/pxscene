# Sample Markdown
Spark supports [markdown](markdown.md) aka **Sparkdown**.  This is a strict markdown implementation (ie no HTML supported).  A list of Spark [gallery](../gallery/gallery.md) samples

## Spark Embedding
Spark even supports markdown with embedded interactive spark content.

### Example of Nested Spark Application
![Embedded Soark Application](../gallery/picturepile2.js)

### Example of Nested Text Document
![Embedded Text Document](loremipsum.txt)

![Embedded PNG Image](../gallery/images/banana.png)

![Embedded SVG Image](../gallery/SVG/Tiger/Tiger.svg =400x400)

## Spark Hyperlinking
You can also link to content.  This leverages Spark's bubbling service feature.  A request for the '.navigate" service up the scene hierarchy is made when you click on a link.  If found then a request to that service can navigate the container's content view. The container has full control.  By default this service is implemented within Spark's browser application as well as the root shell application.

### Example of Linked Text Document
[Linked Text Document](loremipsum.txt)

Some more links

[PNG Link](../gallery/images/banana.png) | [SVG Link](../gallery/SVG/Tiger/Tiger.svg)





