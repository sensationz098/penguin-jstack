"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { client } from "@/lib/client";
import { Button } from "@/components";
import { FormEvent } from "react";
import { DeletePost } from "./DeletePost";

const User = () => {
  const queryClient = useQueryClient();
  const {
    data: mutationData,
    mutate,
    isPending,
  } = useMutation({
    mutationKey: ["create-user"],
    mutationFn: async ({ name, email }: { name: string; email: string }) => {
      const res = await client.user.create.$post({ name, email });
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  console.log("mutationData", mutationData);
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const res = await client.user.getAll.$get();
      return await res.json();
    },
  });

  function submitData(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const form = new FormData(e.currentTarget);

    const name = form.get("name") as string;
    const email = form.get("email") as string;

    mutate({ name: name, email: email });
  }

  return (
    <div>
      {mutationData && <h1>{mutationData.message}</h1>}
      <form onSubmit={submitData} className="border-red-500">
        <input className="border-white" type="text" name="name" />
        <input className="border-white" type="email" name="email" />
        <Button>{isPending ? "Loading..." : "Submit"}</Button>
      </form>
      <div>{isLoading ?? <h1>Loading ...</h1>}</div>
      <div>
        {data?.users.map(({ id, email, name }) => {
          return (
            <h1 key={id}>
              {id} - {name} - {email} - <DeletePost id={id} />
            </h1>
          );
        })}
      </div>
    </div>
  );
};

export default User;
