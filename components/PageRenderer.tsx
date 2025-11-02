'use client';

import { useState } from 'react';
import { Block } from '@cheryx2020/core';

interface Page {
  config: any;
  [key: string]: any;
}

interface Site {
  [key: string]: any;
}

interface PageRendererProps {
  page: Page;
  site: Site;
}

interface ContextType {
  state: Record<string, any>;
  setState: (key: string, value: any) => void;
  toggleState: (key: string) => void;
  site: Site;
  page: Page;
}

export default function PageRenderer({ page, site }: PageRendererProps) {
  const [state, setState] = useState<Record<string, any>>({});

  const context: ContextType = {
    state,
    setState: (key, value) => {
      setState(prev => ({ ...prev, [key]: value }));
    },
    toggleState: (key) => {
      setState(prev => ({ ...prev, [key]: !prev[key] }));
    },
    site,
    page,
  };

  return <Block config={page.config} context={context} />;
}
