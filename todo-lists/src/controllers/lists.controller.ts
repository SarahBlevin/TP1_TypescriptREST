import { FastifyReply, FastifyRequest } from "fastify"
import { ITodoList } from "../interfaces"

// Static Version
/*
const staticLists: ITodoList[] = [
  {
	id: 'l-1',
    title: 'Project',
	description: 'Dev tasks',
    //
  },
  //
]

 export const listLists = async (
  request: FastifyRequest, 
  reply: FastifyReply) => {

   Promise.resolve(staticLists)
   .then((item) => {
 	reply.status(200).send({ data: item })
   })
 }

 export const addList = async (
  request: FastifyRequest, 
  reply: FastifyReply) => {

   const list = request.body as ITodoList
   staticLists.push(list)
   reply.status(200).send({ data: list })
 }

*/

// Dynamic Version

export async function listLists(
  request: FastifyRequest, 
  reply: FastifyReply
) {
  console.log('DB status', this.level.db.status)
  const listsIter = this.level.db.iterator()

  const result: ITodoList[] = []
  for await (const [key, value] of listsIter) {
    result.push(JSON.parse(value))
  }
  reply.send({ data: result })
}

export async function addLists(
  request: FastifyRequest, 
  reply: FastifyReply
) {
 const list = request.body as ITodoList
 const result = await this.level.db.put(
   list.id.toString(), JSON.stringify(list)
 )
 reply.send({ data: result })
}

export async function updateList(
  request: FastifyRequest, 
  reply: FastifyReply
) {
  const { id } = request.params as { id: string };
  const updates = request.body as Partial<ITodoList>;

  try {
    const existingListRaw = await this.level.db.get(id);
    const existingList = JSON.parse(existingListRaw) as ITodoList;

    // Merge 
    const updatedList = { ...existingList, ...updates };

    // Save 
    await this.level.db.put(id, JSON.stringify(updatedList));

    reply.status(200).send({ data: updatedList });
  } catch (error) {
      reply.status(500).send({ error: "An error occurred" });
  }
}













