import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';

import Sort, { SortOptions } from '@/lib/sort';

import FilterHelper from '@/helpers/filter';
import PageContextHelper from '@/helpers/pageContext';

import Filters from '@/components/filters';
import Repositories from '@/components/repositories';

import styles from './page.module.css';

type IndexPageProps = {
  params: {
    filters: string[];
  };
};

export async function generateMetadata({
  params,
}: IndexPageProps): Promise<Metadata> {
  const pageContext = PageContextHelper.get(params.filters);
  return { title: PageContextHelper.getPageTitle(pageContext) };
}

export default async function IndexPage({ params }: IndexPageProps) {
  const [sort, ...filters] = params.filters as [Sort, ...string[]];
  const pageContext = PageContextHelper.get(params.filters);

  const validURL = FilterHelper.getURLFromFilter(pageContext.filter);

  if (!Object.values(SortOptions).includes(sort)) {
    redirect(`/${SortOptions.Trending}/${validURL}`);
  }

  if (validURL !== filters.join('/')) {
    redirect(`/${sort}/${validURL}`);
  }

  return (
    <main className={styles.container}>
      <Filters pageContext={pageContext} />
      <Suspense fallback={<div>Loading...</div>}>
        <Repositories pageContext={pageContext} />
      </Suspense>
    </main>
  );
}
