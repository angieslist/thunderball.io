# Formatting
> The organization and style for how to display a set of data.  This can be numbers, currency, dates, times, etc.

All of the basic formatting rules in Thunderball come from the use of [react-intl](https://github.com/yahoo/react-intl/).
## Date/Time Formatting
### Formatting Dates
[FormattedDate](https://github.com/yahoo/react-intl/wiki/Components#formatteddate) in 'react-intl' should be used wherever possible.

**Examples**
```javascript
<FormattedTime
  value={new Date(1459832991883)} />

// OUTPUT: <span>4/5/2016</span>
```

```javascript
<FormattedTime
  value={Date.parse('1997-07-16T19:20:15')} />

// OUTPUT: <span>7/16/1997</span>
```

### Formatting Times
[FormattedTime](https://github.com/yahoo/react-intl/wiki/Components#formattedtime) in 'react-intl' should be used wherever possible.

**Examples**
```javascript
<FormattedTime
  value={new Date(1459832991883)} />

// OUTPUT: <span>1:09 AM</span>
```

```javascript
<FormattedTime
  value={Date.parse('1997-07-16T19:20:15')} />

// OUTPUT: <span>2:20 PM</span>
```

### Relative Times
[FormattedRelative](https://github.com/yahoo/react-intl/wiki/Components#formattedrelative) in 'react-intl' should be used wherever possible.

**Examples**
```javascript
<FormattedRelative
  value={Date.now()} />

// OUTPUT: <span>now</span>
// ...10 seconds later: <span>10 seconds ago</span>
// ...60 seconds later: <span>1 minute ago</span>
```

## Number Formatting
## Formatting Numbers
[FormattedNumber](https://github.com/yahoo/react-intl/wiki/Components#formattednumber) in 'react-intl' should be used wherever possible.

**Examples**
```javascript
<FormattedNumber
  value={1234} />

// OUTPUT: <span>1,234</span>
```

```javascript
<FormattedNumber
  value={.98}
  style='percent' />

// OUTPUT: <span>98%</span>
```

## Currency
[FormattedNumber](https://github.com/yahoo/react-intl/wiki/Components#formattednumber) in 'react-intl' should be used wherever possible.

**Examples**

```javascript
<FormattedNumber
  value={1234}
  style='currency'
  currency='USD' />

// OUTPUT: <span>$1,234.00</span>
```

```javascript
<FormattedNumber
  value={98.60}
  style='currency'
  currency='USD'
  maximumFractionDigits={0} />

// OUTPUT: <span>$99</span>
```

## Pluralization with Numbers
Often when displaying a number with words, you need to decide the descriptive words should be plural or singular.  For example: '1 item' or '27 items'.

[FormattedPlural](https://github.com/yahoo/react-intl/wiki/Components#formattedplural) in 'react-intl' should be used wherever possible.  It is a simple component that will do the lifting of determining pluralization rules. And allows for multiple plural categories.

**Examples**
```javascript
<FormattedPlural
  value={1}
  one='item'
  other='items' />


// OUTPUT: <span>1 item</span>
```

```javascript
<FormattedPlural
  value={100}
  one='item'
  other='items' />

// OUTPUT: <span>100 items</span>
```

```javascript
<FormattedPlural
  value={2}
  zero='Nobody walks'
  one='A guy walks'
  two='A couple of guys walk'
  few='A few guys walk'
  many='A bunch of guys walk' />
into a bar

// OUTPUT: <span>A couple of guys walk</span> into a bar
```
