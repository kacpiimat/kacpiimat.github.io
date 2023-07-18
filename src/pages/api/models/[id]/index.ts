import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { errorHandlerMiddleware } from 'server/middlewares';
import { modelValidationSchema } from 'validationSchema/models';
import { HttpMethod, convertMethodToOperation, convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  await prisma.model
    .withAuthorization({
      roqUserId,
      tenantId: user.tenantId,
      roles: user.roles,
    })
    .hasAccess(req.query.id as string, convertMethodToOperation(req.method as HttpMethod));

  switch (req.method) {
    case 'GET':
      return getModelById();
    case 'PUT':
      return updateModelById();
    case 'DELETE':
      return deleteModelById();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getModelById() {
    const data = await prisma.model.findFirst(convertQueryToPrismaUtil(req.query, 'model'));
    return res.status(200).json(data);
  }

  async function updateModelById() {
    await modelValidationSchema.validate(req.body);
    const data = await prisma.model.update({
      where: { id: req.query.id as string },
      data: {
        ...req.body,
      },
    });

    return res.status(200).json(data);
  }
  async function deleteModelById() {
    const data = await prisma.model.delete({
      where: { id: req.query.id as string },
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}
