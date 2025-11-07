import { Badge } from 'native-base';

type Props = {
  isOnline?: boolean;
  mr?: number;
};
export function Onlinetag({ isOnline = true, mr = 0 }: Props) {
  return (
    <Badge
      w={130}
      h={42}
      mr={mr}
      bgColor={isOnline ? 'green.500' : 'red.500'}
      rounded={'full'}
      _text={{
        color: isOnline ? 'blue.50' : 'red.50',
        fontSize: 'md',
        fontFamily: 'heading',
      }}
    >
      {isOnline ? 'ONLINE' : 'OFFLINE'}
    </Badge>
  );
}
