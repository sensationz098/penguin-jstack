import { Button } from "@/components";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { client } from "@/lib/client";
import { revalidatePath } from "next/cache";

export const DeletePost = ({ id }: { id: string }) => {
  const queryClient = useQueryClient();
  const { mutate, data, isPending } = useMutation({
    mutationKey: ["delete-post"],
    mutationFn: async (id: string) => {
      const res = await client.user.delete.$post({ id: id });
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      revalidatePath("/");
    },
  });

  return (
    <Button variant={"destructive"} onClick={() => mutate(id)}>
      {isPending ? "Deleting..." : "Delete"}
    </Button>
  );
};
