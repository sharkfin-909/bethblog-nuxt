<script setup lang="ts">
import type { Post, DirectusUser } from '#shared/types/schema';

const route = useRoute();
const { enabled, state } = useLivePreview();
const { isVisualEditingEnabled, apply, setAttr } = useVisualEditing();
const postUrl = useRequestURL();

const slug = route.params.slug as string;

const wrapperRef = ref<HTMLElement | null>(null);

const {
	public: { directusUrl },
} = useRuntimeConfig();

const { data, error, refresh } = await useFetch<{
	post: Post;
	relatedPosts: Post[];
}>(() => `/api/posts/${slug}`, {
	key: `posts-${slug}`,
	query: {
		preview: enabled.value ? true : undefined,
		token: enabled.value ? state.token : undefined,
	},
});

if (!data.value || error.value) {
	throw createError({ statusCode: 404, statusMessage: 'Post not found', fatal: true });
}

const post = computed(() => data.value?.post);
const relatedPosts = computed(() => data.value?.relatedPosts);
const author = computed(() => post.value?.author as Partial<DirectusUser>);

onMounted(() => {
	if (!isVisualEditingEnabled.value) return;
	apply({
		directusUrl,
		onSaved: () => refresh(),
	});
});

useSeoMeta({
	title: post.value?.seo?.title || post.value?.title,
	description: post.value?.seo?.meta_description || post.value?.description,
	ogTitle: post.value?.seo?.title || post.value?.title,
	ogDescription: post.value?.seo?.meta_description || post.value?.description,
	ogUrl: postUrl.toString(),
});
</script>
<template>
	<div v-if="post" ref="wrapperRef">
		<Container class="py-12 flex flex-col items-center">
			<Headline
				:headline="post.title"
				as="h2"
				class="!text-accent mb-4 text-center w-[50%]"
				:data-directus="setAttr({ collection: 'posts', item: post.id, fields: ['title', 'slug'], mode: 'popover' })"
			/>
			<Separator class="h-[1px] bg-gray-400 my-8" />
			<p>{{ post.description }}</p>
			<Separator class="h-[1px] bg-gray-400 my-8" />

			<div v-if="post.image" class="mb-2 px-4 w-full flex justify-center">
				<div
					class="relative  h-[500px] overflow-hidden rounded-lg"
					:data-directus="
						setAttr({ collection: 'posts', item: post.id, fields: ['image', 'meta_header_image'], mode: 'modal' })
					"
				>
					<DirectusImage
						:uuid="post.image as string"
						:alt="post.title || 'post header image'"
						class="object-cover w-full h-full"
						sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 1200px"
						fill
					/>
				</div>
			</div>
			<Separator class="h-[1px] bg-gray-400 my-8" />

			<div class="w-[70%] flex justify-center ">
				<main class="w-full pb-12">
					<Text
						:content="post.content || ''"
						:data-directus="
							setAttr({
								collection: 'posts',
								item: post.id,
								fields: ['content', 'meta_header_content'],
								mode: 'drawer',
							})
						"
					/>
				</main>
			</div>
			<div >
						<Separator class="h-[1px] bg-gray-300 my-4" />
						<h3 class="font-bold mb-4">Related Posts</h3>
						<div class="space-y-4">
							<NuxtLink
								v-for="relatedPost in relatedPosts"
								:key="relatedPost.id"
								:to="`/blog/${relatedPost.slug}`"
								class="flex items-center space-x-4 hover:text-accent group"
							>
								<div v-if="relatedPost.image" class="relative shrink-0 w-[150px] h-[100px] overflow-hidden rounded-lg">
									<DirectusImage
										:uuid="relatedPost.image as string"
										:alt="relatedPost.title || 'related post image'"
										class="object-cover transition-transform duration-300 group-hover:scale-110"
										fill
										sizes="(max-width: 768px) 100px, (max-width: 1024px) 150px, 150px"
									/>
								</div>
								<span class="font-heading">{{ relatedPost.title }}</span>
							</NuxtLink>
						</div>
					</div>
		</Container>
	</div>
	<div v-else class="text-center text-xl mt-[20%]">404 - Post Not Found</div>
</template>
