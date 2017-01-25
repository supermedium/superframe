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

Go to the folder of the component or scene you wish to develop and check out
its README. The steps generally involve:

```bash
git clone git@github.com:ngokevin/kframe && cd kframe
# Head to the folder to develop (e.g., `cd components/foo`, `cd scenes/foo`).
npm install
npm run dev  # (or sometimes `npm run start`)
```

A page should open in your browser. You can develop on the source code and the
server will handle live compilation and bundling.
