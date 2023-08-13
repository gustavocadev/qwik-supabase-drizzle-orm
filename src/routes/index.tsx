import { component$ } from '@builder.io/qwik';
import {
  routeLoader$,
  type DocumentHead,
  zod$,
  z,
  routeAction$,
  Form,
} from '@builder.io/qwik-city';
import { db } from '~/lib/server/db';
import { users } from '~/lib/server/schema';

export const useSupabaseData = routeLoader$(async () => {
  const allUsers = await db.query.users.findMany();
  return allUsers;
});

export const useCreateNewUser = routeAction$(
  async (values) => {
    await db.insert(users).values({
      fullName: values.full_name,
      phone: values.phone,
    });

    return {
      success: true,
    };
  },
  zod$({
    full_name: z.string(),
    phone: z.string(),
  })
);

export default component$(() => {
  const supabaseData = useSupabaseData();
  console.log(supabaseData.value);
  const createUser = useCreateNewUser();
  return (
    <main class="max-w-2xl mx-auto py-20">
      <Form action={createUser} class="flex flex-col  gap-4" spaReset>
        <div class="flex flex-col gap-2">
          <label for="">Full name</label>
          <input name="full_name" type="text" class="bg-base-200 input" />
        </div>

        <div class="flex flex-col gap-2">
          <label for="">Phone</label>
          <input name="phone" type="text" class="bg-base-200 input" />
        </div>

        <button type="submit" class="btn btn-primary">
          Create new user
        </button>
        <p class="text-green-500 text-lg font-semibold">
          {createUser.value?.success && 'User created successfully!'}
        </p>
      </Form>

      <section>
        <h2>Supabase Users Data</h2>
        <ul class="list-disc list-inside">
          {supabaseData.value.map((user) => (
            <li key={user.id}>{user.fullName}</li>
          ))}
        </ul>
      </section>
    </main>
  );
});

export const head: DocumentHead = {
  title: 'Welcome to Qwik',
  meta: [
    {
      name: 'description',
      content: 'Qwik site description',
    },
  ],
};
