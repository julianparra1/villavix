import { getRecentPostsWithSummary } from "@/app/actions";
import ResumenesClient from "@/components/resumen-client";
import { revalidatePath } from "next/cache";
import { Suspense } from "react";

export const dynamic = 'force-dynamic';

type SearchParams = Promise<{ [key: string]: string | undefined }>

export default async function Resumenes(props: {
    searchParams: SearchParams
}) {
    const searchParams = await props.searchParams;
    const searchQuery = searchParams.q || '';

    const result = await getRecentPostsWithSummary(5, undefined, searchQuery);

    const timestamp = Date.now();

    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ResumenesClientWrapper
                searchQuery={searchQuery}
                timestamp={timestamp}
            />
        </Suspense>
    );
}

async function ResumenesClientWrapper({
    searchQuery,
    timestamp
}: {
    searchQuery: string;
    timestamp: number;
}) {
    const result = await getRecentPostsWithSummary(5, undefined, searchQuery);

    return (
        <ResumenesClient
            key={`${searchQuery}-${timestamp}`}
            initialData={result}
            searchQuery={searchQuery}
        />
    );
}