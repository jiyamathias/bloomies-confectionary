'use client';
// ContentProvider: takes server-fetched published/draft overrides and makes them
// available to useSection() on the first render, before localStorage hydration.
import { createContext, useContext } from 'react';
import type { Overrides } from '@/lib/content/store';

interface ContentCtx {
  published: Overrides;
  draft: Overrides;
}

const ContentContext = createContext<ContentCtx>({ published: {}, draft: {} });

export function ContentProvider({
  published,
  draft,
  children,
}: {
  published: Overrides;
  draft:     Overrides;
  children:  React.ReactNode;
}) {
  return (
    <ContentContext.Provider value={{ published, draft }}>
      {children}
    </ContentContext.Provider>
  );
}

export function useServerContent(): ContentCtx {
  return useContext(ContentContext);
}
