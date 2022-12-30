import { type VoidComponent, Switch, Match } from "solid-js";
import { Title, useRouteData } from "solid-start";
import { trpc } from "~/utils/trpc";
import { createServerData$ } from "solid-start/server";
import { getSession } from "@solid-auth/next";
import { authOpts } from "./api/auth/[...solidauth]";
import { signIn, signOut } from "@solid-auth/next/client";

export const routeData = () => {
  return createServerData$(async (_, { request }) => {
    return await getSession(request, authOpts);
  });
};

const Home: VoidComponent = () => {
  const session = useRouteData<typeof routeData>();
  const res = trpc.secret.useQuery(undefined, {
    get enabled() {
      return !!session()?.user;
    },
  });

  return (
    <>
      <Title>Home</Title>
      <div>
        <Switch 
          fallback={
            <pre class="font-bold text-2xl text-gray-500">
              {JSON.stringify(res.data, null, 2)}
            </pre>
          }
        >
          <Match when={res.isLoading}>
            <div class="font-bold text-2xl text-gray-500">
              {res.isFetching ? "Loading" : "Not Logged In"}
            </div>
          </Match>
        </Switch>
        <Switch
          fallback={
            <button
              onClick={() => signIn("github")}
              
              class="bg-purple-700 mx-3 my-3 rounded-lg w-56 p-2.5 text-white font-bold flex items-center justify-center"
            >
              Login
            </button>
          }
        >
          <Match when={session.loading}>
            <h1>Loading session</h1>
          </Match>
          <Match when={session()}>
            <button
              onClick={() => signOut()}
              
              class="bg-purple-700 mx-3 my-3 rounded-lg w-56 p-2.5 text-white font-bold flex items-center justify-center"
            >
              Logout
            </button>
          </Match>
        </Switch>
      </div>
    </>
  );
};

export default Home;
