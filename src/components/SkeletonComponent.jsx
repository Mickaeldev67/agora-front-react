import Skeleton from 'react-loading-skeleton';

function SkeletonComponent () {
    return (
        <section className="border rounded p-4 mb-4 bg-gray-50">
            <Skeleton height={10} width={120} />
            <Skeleton height={10} width={80} />
            <Skeleton height={24} />
            <Skeleton height={20} />
            <Skeleton height={20} width={70}/>
        </section>
    )
}

export default SkeletonComponent;