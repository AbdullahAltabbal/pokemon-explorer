import { useInfiniteQuery } from "@tanstack/react-query";

type PokemonListResponse = {
	count: number;
	next: string | null;
	previous: string | null;
	results: Pokemon[];
};

type Pokemon = {
	id: number;
	name: string;
	image: string;
	url: string;
};

type DetailedPokemon = {
	name: string;
	sprites: {
		other: {
			"official-artwork": {
				front_default: string;
			};
		};
	};
	id: number;
};

export function useGetPokemons() {
	const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
		useInfiniteQuery<{
			pokemons: { id: number; name: string; image: string }[];
			nextPage: string | null;
		}>({
			queryKey: ["pokemonList"],
			initialPageParam: "https://pokeapi.co/api/v2/pokemon?limit=20",
			queryFn: async ({ pageParam }) => {
				const response = await fetch(pageParam as string);
				if (!response.ok) {
					throw new Error("Network response was not ok");
				}
				const listData: PokemonListResponse = await response.json();

				const detailedPokemons = await Promise.all(
					listData.results.map(async (pokemon) => {
						const detailResponse = await fetch(pokemon.url);
						const detailData: DetailedPokemon = await detailResponse.json();
						return {
							id: detailData.id,
							name: detailData.name,
							image: detailData.sprites.other["official-artwork"].front_default,
						};
					})
				);

				return {
					pokemons: detailedPokemons,
					nextPage: listData.next,
				};
			},
			getNextPageParam: (lastPage) => lastPage.nextPage ?? undefined,
		});

	return {
		pokemons: data?.pages.flatMap((page) => page.pokemons) ?? [],
		isLoading,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
	};
}
