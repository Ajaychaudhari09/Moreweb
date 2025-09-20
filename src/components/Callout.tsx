// src/components/Callout.tsx
export default function Callout({
  type,
  children,
}: {
  type: 'info' | 'warning' | 'success';
  children: React.ReactNode;
}) {
  const colors = { info: 'bg-blue-100', warning: 'bg-yellow-100', success: 'bg-green-100' };
  return (
    <div className={`${colors[type]} p-4 rounded-md my-4`}>
      {children}
    </div>
  );
}
