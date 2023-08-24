import type {Metadata} from "next";

import "./globals.css";
import Link from "next/link";
import {Suspense} from "react";

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

function ListItemLoading() {
  return (
    <div className="grid h-[64px] items-center">
      <div className="w-full animate-pulse" role="status">
        <div className="h-2.5 w-full rounded-full bg-gray-200 dark:bg-gray-700" />
        <span className="sr-only">Loading...</span>
      </div>
      <div className="flex items-center justify-between">
        <div className="w-full animate-pulse" role="status">
          <div className="h-2.5 w-12 rounded-full bg-gray-200 dark:bg-gray-700" />
          <span className="sr-only">Loading...</span>
        </div>
        <div className="w-full animate-pulse" role="status">
          <div className="h-2.5 w-full rounded-full bg-gray-200 dark:bg-gray-700" />
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    </div>
  );
}

async function ListItem({id}: {id: number}) {
  await sleep(Math.random() * 3000);

  const post = await fetch(
    `https://hacker-news.firebaseio.com/v0/item/${id}.json?print=pretty`,
  ).then((res) => res.json() as Promise<{title: string; url: string; by: string}>);

  return (
    <div className="flex h-[64px] flex-col gap-2">
      <p className="truncate">{post.title || post.by}</p>
      <div className="flex items-center justify-between opacity-50">
        <p>{post.by}</p>
        <p>Visit website {`>>`}</p>
      </div>
    </div>
  );
}

export default async function RootLayout({children}: {children: React.ReactNode}) {
  const posts = await fetch(
    `https://hacker-news.firebaseio.com/v0/topstories.json?print=pretty&limitToFirst=10&orderBy="$key"`,
  ).then((res) => res.json() as Promise<number[]>);

  return (
    <html lang="en">
      <body className="grid h-screen grid-rows-[60px,1fr]">
        <header className="grid place-content-center bg-yellow-400 font-semibold text-black">
          Uizard Hackernews Reader
        </header>
        <main className="grid grid-cols-[320px,1fr] gap-4">
          <aside>
            <ul className="flex flex-col gap-4 p-4">
              {posts.map((id) => (
                <li key={id}>
                  <Link href={`/${id}`}>
                    <Suspense fallback={<ListItemLoading />}>
                      <ListItem id={id} />
                    </Suspense>
                  </Link>
                </li>
              ))}
            </ul>
          </aside>
          <section>{children}</section>
        </main>
      </body>
    </html>
  );
}
