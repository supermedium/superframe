# kframe

![kframe](https://cloud.githubusercontent.com/assets/674727/15790659/69860590-2987-11e6-9511-65c28e583c6f.png)

Kevin's collection of A-Frame components and scenes.

[VIEW DEMOS](https://ngokevin.github.io/kframe/)

## Components

See documentation for individual components:

{% for component in components -%}
- [{{ component.name }}]({{ component.github }}) - {{ component.description }}
{% endfor %}

## Local Installation

```bash
git clone git@github.com:ngokevin/kframe
npm install  # Run npm install on all inner modules
npm run dev  # Webpack dev server that watches all component files
```
