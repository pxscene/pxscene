# Table example

| Left | Center | Right |
| :----------- | :--: | ---: |
| Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam viverra neque at diam pulvinar sagittis. Sed tincidunt arcu id feugiat vestibulum. Morbi erat lectus, aliquet a euismod quis, volutpat vel magna. Duis at ipsum porttitor, lobortis eros gravida, auctor quam. Phasellus sed viverra nulla. Donec id magna magna. Nam non pretium justo. Nulla facilisi. In vel porttitor augue. Praesent dignissim nisi massa, quis ultrices magna euismod blandit. Nunc vel odio malesuada, consequat ex vitae, lacinia nisl. Sed at ipsum erat. Nullam ut molestie leo. Integer at ante massa. Interdum et malesuada fames ac ante ipsum primis in faucibus. Aenean nisi augue, iaculis sed odio ac, vestibulum pulvinar mi.  Morbi varius viverra nibh, eu iaculis sapien rhoncus vel. Integer imperdiet lorem eu nisl consectetur condimentum. In lacus velit, tincidunt sed fringilla vel, elementum eu libero. Vivamus ac consequat lorem. Praesent vitae mauris ultricies, malesuada dolor ac, faucibus mi. Nam orci tortor, tristique vel fermentum ac, vestibulum non sem. Praesent blandit odio massa, sit amet pulvinar ex dictum sit amet. Ut at nulla dui. Donec eget est a nibh commodo maximus. |  Center  | Right |

## 1. Simple table

| Column 1 | Column 2 | Column 3 | Column 4 |
|----------|:--------:|----------|----------|
| 100      |    200   | 300      | 400      |
| 100      |    200   | 300      | 400      |
| 100      |    200   | 300      | 400      |

## 2. Table with different alignment

| Default  |  Left    | Center   | Right    |
|----------|:---------|:--------:|---------:|
| 100      |    200   | 300      | 400      |
| 100      |    200   | 300      | 400      |
| 100      |    200   | 300      | 400      |

## 3. Table with fault tolerance

**Note**:
- one row has less columns
- one row has more columns

| Default  |  Left    | Center   | Right    |
|----------|:---------|:--------:|---------:|
| 100      |    200   | 300      | 400      |
| 100      |    200   | 300      |
| 100      |    200   | 300      | 400      |  should not be rendered |

## 4. Table with links, code, auto line wrap (More rows and columns)

| Default  |  Left    | Center   | Right    | Another column
|----------|:---------|:--------:|---------:|---------:|
| Hello, what do you think it is, that's cool right?     |    [Linked Text Document](loremipsum.txt)   | [SVG Link](../gallery/SVG/Tiger/Tiger.svg)      | 400      | 300       | Hello    |
| `#include <stdio.h>`      |    `This is a markdown`   | 300      | Hello    |
| 100      |    200   | 300      | 400      | Hello    |
| 100      |    200   | 300      | 400      | Hello    |
| 100      |    200   | 300      | 400      | Hello    |

## 5. Complex Table example

**Table with links, code, bold, italic, underline, auto line wrap, nested Text Document**

|Column 1  |  Column 2 |Column 3  |Column 4  |
|----------|:---------:|----------|----------:|
| 100      |  xxxxxxxxxxxxxx| 300      |     400 |
| *100*      |       200 | 300      |    400    |
| **100**      |       200 | 300      |    400      |
| __100 ssss sss aaaa__      |       200 | 300      |    400      |
| [xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx](loremipsum.txt)      |       [PNG Link](../gallery/images/banana.png) | 300      |    [SVG Link](../gallery/SVG/Tiger/Tiger.svg)      |
| `#include <stdio>`      |       `200` | 300      |    400      |
| ![Embedded Text Document](loremipsum.txt)      |       `200` | 300      |    400      |
| ![Embedded Soark Application](../gallery/picturepile2.js)      |       `200` | 300      |    400      |
| ![Embedded PNG Image](../gallery/images/banana.png)      |   `200`     | 300      |    400      |
| ![Embedded SVG Image](../gallery/SVG/Tiger/Tiger.svg =400x400)      |   `200`     | 300      |    400      |


## 6. Strikethrough

(1) Simple strikethrough

~~simple strikethrough~~

(2) Strikethrough with Bold text

~~**bold strikethrough**~~

(3) Strikethrough with Italic text

~~*italic strikethrough*~~

(4) Strikethrough with code span

~~`print 'This is a code'`~~

(5) Mixed sample

Hi, this is **a mixed** example. ~~Be **Bold** or *Italtic*, but never `Regular`~~

# Other examples

## 1. Spark Embedding
Spark even supports markdown with embedded interactive spark content.

### 1.1 Example of Nested Spark Application
![Embedded Soark Application](../gallery/picturepile2.js)

### 1.2 Example of Nested Text Document
![Embedded Text Document](loremipsum.txt)

![Embedded PNG Image](../gallery/images/banana.png)

![Embedded SVG Image](../gallery/SVG/Tiger/Tiger.svg =400x400)

## 2. Spark Hyperlinking
You can also link to content.  This leverages Spark's bubbling service feature.  A request for the '.navigate" service up the scene hierarchy is made when you click on a link.  If found then a request to that service can navigate the container's content view. The container has full control.  By default this service is implemented within Spark's browser application as well as the root shell application.

### 2.1 Example of Linked Text Document
[Linked Text Document](loremipsum.txt)

Some more links

[PNG Link](../gallery/images/banana.png) | [SVG Link](../gallery/SVG/Tiger/Tiger.svg)
