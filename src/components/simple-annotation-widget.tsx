import { useState } from 'react';

function SimpleAnnotationWidget() {
  const [text, setText] = useState('');
  const [ans, setAns] = useState<string[]>([]);
  
  const submit = async () => {
    const res = await fetch('/api/annotate', {
      method:'POST', 
      headers:{'Content-Type':'application/json'}, 
      body:JSON.stringify({text})
    });
    const data = await res.json();
    setAns(data.annotations);
  };
  
  return (
    <div className="p-4">
      <textarea 
        value={text} 
        onChange={e=>setText(e.target.value)} 
        className="w-full h-32 border border-gray-300 rounded p-2"
        placeholder="Enter text to annotate..."
      />
      <button 
        onClick={submit} 
        className="mt-2 px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
      >
        Annotate
      </button>
      <ul className="mt-4 list-disc pl-6">
        {ans.map((a,i)=><li key={i} className="mb-1">{a}</li>)}
      </ul>
    </div>
  );
}

export default SimpleAnnotationWidget;