# Writing JavaScript-Style Code in This Project

TypeScript has been configured to be **very permissive**. You can now write code that looks and feels like JavaScript!

## What Changed

✅ All strict type checking is **disabled**  
✅ You can use `.jsx` files alongside `.tsx` files  
✅ No more type errors for missing types  
✅ Optional types - use them only if you want  

## How to Write Code

### Option 1: Ignore Types Completely

Just write regular JavaScript in `.tsx` files:

```jsx
// No types needed!
export default function MyComponent({ project }) {
  const [data, setData] = useState(null);
  
  const handleClick = (e) => {
    console.log(e.target.value);
  };
  
  return <div onClick={handleClick}>{project.name}</div>;
}
```

### Option 2: Create New .jsx Files

You can create new components as `.jsx` files:

```jsx
// app/components/MyNewComponent.jsx
import { useState } from 'react';

export default function MyNewComponent(props) {
  const [count, setCount] = useState(0);
  
  return (
    <div>
      <h1>{props.title}</h1>
      <button onClick={() => setCount(count + 1)}>
        Count: {count}
      </button>
    </div>
  );
}
```

Then import it anywhere:
```jsx
import MyNewComponent from '../components/MyNewComponent';
```

### Option 3: Remove Type Annotations

When editing existing `.tsx` files, just delete the type annotations:

**Before:**
```tsx
const [projects, setProjects] = useState<Project[]>([]);
const handleSubmit = async (e: React.FormEvent) => {
```

**After:**
```jsx
const [projects, setProjects] = useState([]);
const handleSubmit = async (e) => {
```

## Working with Existing Code

### Services (API calls)

You can ignore the interfaces and just use the data:

```jsx
// Instead of worrying about the Project interface
import { projectService } from '../services/projectService';

// Just use it
const projects = await projectService.getAllProjects();
console.log(projects[0].name); // Works fine!
```

### Props

No need to define prop types:

```jsx
// Old way (TypeScript)
interface MyProps {
  title: string;
  count: number;
}
export default function MyComponent({ title, count }: MyProps) {

// New way (JavaScript-style)
export default function MyComponent({ title, count }) {
```

### Event Handlers

Just use regular event parameters:

```jsx
// No need for React.ChangeEvent<HTMLInputElement>
const handleChange = (e) => {
  console.log(e.target.value);
};

const handleSubmit = (e) => {
  e.preventDefault();
  // your code
};
```

## Tips

1. **Keep `.tsx` extension** - It still works, just write JS-style code in it
2. **Or use `.jsx`** - Create new files as `.jsx` if you prefer
3. **Ignore red squiggles** - If you see type warnings, they won't break your build
4. **Use PropTypes (optional)** - If you want runtime validation:
   ```jsx
   import PropTypes from 'prop-types';
   
   MyComponent.propTypes = {
     title: PropTypes.string,
     count: PropTypes.number
   };
   ```

## Examples

### Creating a New Component

```jsx
// app/components/ProductCard.jsx
export default function ProductCard({ product }) {
  return (
    <div className="card">
      <img src={product.image} alt={product.name} />
      <h3>{product.name}</h3>
      <p>{product.price}</p>
    </div>
  );
}
```

### Editing Existing Components

Just remove the type annotations from any `.tsx` file:

```jsx
// app/routes/home.tsx (yes, keep the .tsx extension)
export default function Home() {
  const [data, setData] = useState(null);
  
  // Write regular JavaScript!
  const fetchData = async () => {
    const response = await fetch('/api/data');
    const json = await response.json();
    setData(json);
  };
  
  return <div>Home Page</div>;
}
```

## What About Route Types?

For routes, you can ignore the type imports:

```jsx
// Before
import type { Route } from "./+types/home";
export function meta({}: Route.MetaArgs) {

// After - just remove the type import and annotations
export function meta() {
  return [
    { title: "My Page" },
  ];
}
```

## Summary

✨ **You can now code like it's JavaScript!**  
✨ **No type errors will stop you**  
✨ **Mix `.jsx` and `.tsx` files freely**  
✨ **Focus on building features, not fighting types**

Happy coding! 🚀
