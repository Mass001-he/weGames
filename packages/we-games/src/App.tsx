import { useState } from "react";
import { Button } from "./components/Button";

function ChildrenComponent() {
  console.log("children component");
  return <div className="text-3xl font-bold">children component</div>;
}

function App() {
  const [count, setCount] = useState(0);
  return (
    <>
      <div className="text-4xl font-bold">we-games</div>
      <div>
        <Button type="primary" onClick={() => setCount(count + 1)}>
          新增{count}
        </Button>
      </div>
      <ChildrenComponent />
    </>
  );
}

export default App;
