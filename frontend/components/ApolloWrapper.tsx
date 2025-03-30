'use client';

import { createClient } from '@/services/graphql.service';
import { ApolloProvider } from '@apollo/client';
import { useMemo } from 'react';

export default function ApolloWrapper({ children }: { children: React.ReactNode }) {
    const client = useMemo(() => createClient(), []); 
    return <ApolloProvider client={client}>{children}</ApolloProvider>;
}