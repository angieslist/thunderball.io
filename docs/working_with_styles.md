# Working with Styles

## Principles
- Consider **theming**.  Avoid directly using colors or colors by name.  Instead refer to more generic variables like `brandPrimary`, `brandPrimaryDark`, or `brandWarning`.  
  - You can use css preprocessor methods in SCSS and LESS like `darken(COLOR, PERCENT)` and `lighten(COLOR, PERCENT)` to construct new colors based on a base color.

## CSS Preprocessors
- Thunderball allows you to import `.css`, `.less`, `.scss`, `.sass`, or `.style` files into your project.

## Where should styles go?
### Inline Styles
Css specificity can be tricky.  You may come up with what you consider a unique name, that is actually used somewhere else, or something may cascade from your component that you didnt intend.

In traditional html and css, it is good practice to avoid "inline styles".  However, with React, the disadvantages of "inline styles" disappear:
- repetition: inline styles are usually bad because you repeat code instead of making them reusable.  But in React, inline styles are just objects which can be shared.
- lack of composition:


### Hierarchy of Inline Styling

### When to use CSS vs Inline Styles