# Performance
ReactJs by itself can be extremely performant due to its' [virtual DOM diffing](https://facebook.github.io/react/docs/reconciliation.html).  However, there are still pitfalls to watch for and ways to speed up the code.

*Facebook covers a number of performance considerations: https://facebook.github.io/react/docs/advanced-performance.html.*

## Pure Components
Virtual DOM diffing (also know as **reconciliation**) does prevent unnecessary DOM updates.  However, this diff is not "free". Rendering a virtual DOM tree in memory can take dozens of milliseconds.  This may not sound like much, but if you have async requests coming in that are causing multiple reloads, this can add up very quickly.

Fortunately, ReactJs has a mechanism to check whether or not an element should consider re-rendering itself to the virtual DOM.  [shouldComponentUpdate](https://facebook.github.io/react/docs/component-specs.html#updating-shouldcomponentupdate) is a ReactJs lifecycle method that can be used to compare current and next `props` and `state` to return `false` if the component should not update.  A good practice is to make use of this to avoid unnecessary reconciliation.

The diagram below, shows how shoundComponentUpdate (SCU) works:



![](https://facebook.github.io/react/img/docs/should-component-update.png)



## Optimizing Render

http://moduscreate.com/react_component_rendering_performance/
http://www.slideshare.net/grgur/webpack-react-performance-in-16-steps