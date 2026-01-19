
import { cookies } from "next/headers";
import { notFound } from "next/navigation";

export default async function TestSessionPage() {
    if (process.env.NODE_ENV === 'production') {
        notFound();
    }

    const cookieStore = await cookies();
    const allCookies = cookieStore.getAll();

    return (
        <div className="p-10 bg-white text-black">
            <h1 className="text-2xl font-bold mb-4">Server-Side Cookie Dump</h1>
            <pre className="p-4 bg-gray-100 rounded">
                {JSON.stringify(allCookies, null, 2)}
            </pre>
            <div className="mt-4">
                <h2 className="text-xl font-bold">Diagnostics:</h2>
                <ul className="list-disc ml-5">
                    <li>
                        appwrite-session found?{" "}
                        <span className={cookieStore.has("appwrite-session") ? "font-bold text-green" : "font-bold text-red"}>
                            {cookieStore.has("appwrite-session") ? "YES" : "NO"}
                        </span>
                    </li>
                </ul>
            </div>
        </div>
    );
}
