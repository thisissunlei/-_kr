npm run build


if [ $1 = 'prod01' ]; then

rsync -rvltOD ./* ali-krspace-web-01:/data/work/web_cdn/kr_meeting

elif [ $1 = 'prod02' ]; then

rsync -rvltOD ./* ali-krspace-web-02:/data/work/web_cdn/kr_meeting

elif [ $1 = 'all' ]; then

rsync -rvltOD ./* ali-krspace-web-01:/data/work/web_cdn/kr_meeting
rsync -rvltOD ./* ali-krspace-web-02:/data/work/web_cdn/kr_meeting

fi