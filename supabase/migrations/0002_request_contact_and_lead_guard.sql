alter table service_requests
  add column if not exists contact_email text not null default 'requester@example.com';

update service_requests
set contact_email = case id
  when 'b1000000-0000-0000-0000-000000000001' then 'alex.moveout@example.com'
  when 'b1000000-0000-0000-0000-000000000002' then 'sam.kitchen@example.com'
  when 'b1000000-0000-0000-0000-000000000003' then 'parent.math@example.com'
  when 'b1000000-0000-0000-0000-000000000004' then 'ops.office@example.com'
  else contact_email
end
where contact_email = 'requester@example.com';

create unique index if not exists leads_provider_request_unique
  on leads (provider_profile_id, service_request_id);

update leads
set
  match_score = coalesce(match_score, 50),
  match_score_source = coalesce(match_score_source, 'rule-based-v1'),
  match_score_confidence = coalesce(match_score_confidence, 1.0),
  match_score_review_status = coalesce(match_score_review_status, 'unreviewed');
